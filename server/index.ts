import express, { type NextFunction, type Request, type Response } from "express";
import mysql from "mysql2/promise";
import type { ResultSetHeader } from "mysql2";
import multer from "multer";
import sharp from "sharp";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scrypt = promisify(scryptCallback);
const app = express();
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const builtStaticPath = path.resolve(here, "public");
const sourceStaticPath = path.join(projectRoot, "client", "public");
const staticPath = existsSync(builtStaticPath) ? builtStaticPath : sourceStaticPath;
const mediaPath = path.join(projectRoot, "storage", "media");

// Read an ignored .env file for cPanel deployments; control-panel environment
// variables take precedence and remain the preferred option when available.
try {
  const localEnv = readFileSync(path.join(projectRoot, ".env"), "utf8");
  for (const line of localEnv.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      const value = match[2].replace(/^(['"])(.*)\1$/, "$2").replace(/\s+#.*$/, "");
      process.env[match[1]] = value;
    }
  }
} catch { /* .env is optional */ }
const isProduction = process.env.NODE_ENV === "production";

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "Z",
});

const noStore = (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("Pragma", "no-cache");
  next();
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const cookieName = "chi_admin";
const cookieOptions = `Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${isProduction ? "; Secure" : ""}`;

type CmsUser = { id: number; email: string; displayName: string };
type CmsSession = { user_id: number; csrf_token: string; display_name: string; email: string };

function readCookie(header: string | undefined, key: string): string | undefined {
  return header?.split(";").map((entry) => entry.trim()).find((entry) => entry.startsWith(`${key}=`))?.slice(key.length + 1);
}

async function sessionFor(req: Request): Promise<CmsSession | null> {
  const token = readCookie(req.headers.cookie, cookieName);
  if (!token || token.length > 200) return null;
  const [rows] = await pool.execute(
    "SELECT s.user_id, s.csrf_token, u.display_name, u.email FROM cms_sessions s JOIN cms_admins u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at > UTC_TIMESTAMP() AND u.active=1 LIMIT 1",
    [hash(token)],
  );
  return (rows as CmsSession[])[0] || null;
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionFor(req);
    if (!session) {
      res.clearCookie(cookieName, { path: "/", httpOnly: true, sameSite: "strict", secure: isProduction });
      res.status(401).json({ error: "Please sign in to continue." });
      return;
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const supplied = req.header("x-csrf-token") || "";
      const expected = Buffer.from(session.csrf_token);
      const actual = Buffer.from(supplied);
      if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        res.status(403).json({ error: "The security token expired. Refresh the page and try again." });
        return;
      }
    }
    res.locals.cmsUser = { id: session.user_id, email: session.email, displayName: session.display_name } satisfies CmsUser;
    res.locals.csrfToken = session.csrf_token;
    next();
  } catch (error) {
    next(error);
  }
}

const adminApi = express.Router();
adminApi.use(noStore);

adminApi.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase().slice(0, 254);
    const password = String(req.body?.password || "");
    if (!email || !password || password.length > 1024) {
      res.status(400).json({ error: "Enter your email and password." });
      return;
    }
    const ipHash = hash(String(req.ip || "unknown"));
    const emailHash = hash(email);
    const [attemptRows] = await pool.execute(
      "SELECT COUNT(*) AS failures FROM cms_login_attempts WHERE email_hash=? AND ip_hash=? AND succeeded=0 AND attempted_at > UTC_TIMESTAMP() - INTERVAL 15 MINUTE",
      [emailHash, ipHash],
    );
    if (Number((attemptRows as { failures: number }[])[0]?.failures || 0) >= 8) {
      res.status(429).json({ error: "Too many sign-in attempts. Wait 15 minutes and try again." });
      return;
    }
    const [userRows] = await pool.execute("SELECT id,email,display_name,password_hash FROM cms_admins WHERE email=? AND active=1 LIMIT 1", [email]);
    const user = (userRows as { id: number; email: string; display_name: string; password_hash: string }[])[0];
    let valid = false;
    if (user?.password_hash.startsWith("scrypt$")) {
      const [, salt, stored] = user.password_hash.split("$");
      const actual = (await scrypt(password, salt, 64)) as Buffer;
      const expected = Buffer.from(stored, "hex");
      valid = expected.length === actual.length && timingSafeEqual(expected, actual);
    }
    await pool.execute("INSERT INTO cms_login_attempts(email_hash,ip_hash,succeeded) VALUES(?,?,?)", [emailHash, ipHash, valid ? 1 : 0]);
    if (!valid) {
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    const token = randomBytes(32).toString("base64url");
    const csrfToken = randomBytes(32).toString("base64url");
    const expires = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await pool.execute("INSERT INTO cms_sessions(token_hash,user_id,csrf_token,expires_at) VALUES(?,?,?,?)", [hash(token), user.id, csrfToken, expires]);
    await pool.execute("DELETE FROM cms_sessions WHERE expires_at < UTC_TIMESTAMP()");
    await pool.execute("DELETE FROM cms_login_attempts WHERE attempted_at < UTC_TIMESTAMP() - INTERVAL 2 DAY");
    res.setHeader("Set-Cookie", `${cookieName}=${token}; ${cookieOptions}`);
    res.json({ user: { email: user.email, displayName: user.display_name }, csrfToken });
  } catch (error) {
    next(error);
  }
});

adminApi.get("/me", requireAdmin, (_req, res) => {
  res.json({ user: res.locals.cmsUser, csrfToken: res.locals.csrfToken });
});

adminApi.post("/logout", requireAdmin, async (req, res, next) => {
  try {
    const token = readCookie(req.headers.cookie, cookieName);
    if (token) await pool.execute("DELETE FROM cms_sessions WHERE token_hash=?", [hash(token)]);
    res.clearCookie(cookieName, { path: "/", httpOnly: true, sameSite: "strict", secure: isProduction });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

const slugify = (value: string) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 140);
const cleanText = (value: unknown, max = 20000) => String(value ?? "").trim().slice(0, max);
const validDate = (value: unknown) => {
  if (!value) return true;
  const normalized = String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;
  const date = new Date(`${normalized}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === normalized;
};

adminApi.get("/programs", requireAdmin, async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT id,slug,title,summary,description,status,starts_on,ends_on,hero_image,updated_at FROM cms_programs ORDER BY starts_on DESC, id DESC");
    const [activities] = await pool.query("SELECT id,program_id,title,activity_date,location,summary,description,status,image_path,updated_at FROM cms_activities ORDER BY activity_date DESC, id DESC");
    res.json({ programs: rows, activities });
  } catch (error) { next(error); }
});

adminApi.post("/programs", requireAdmin, async (req, res, next) => {
  try {
    const title = cleanText(req.body?.title, 180);
    const slug = slugify(cleanText(req.body?.slug || title, 180));
    const status = req.body?.status === "published" ? "published" : "draft";
    const startsOn = req.body?.startsOn || null;
    const endsOn = req.body?.endsOn || null;
    if (!title || !slug || !validDate(startsOn) || !validDate(endsOn) || (startsOn && endsOn && endsOn < startsOn)) {
      res.status(400).json({ error: "Enter a title, valid dates, and an end date after the start date." }); return;
    }
    const [result] = await pool.execute("INSERT INTO cms_programs(slug,title,summary,description,status,starts_on,ends_on,hero_image) VALUES(?,?,?,?,?,?,?,?)", [slug,title,cleanText(req.body?.summary,500),cleanText(req.body?.description),status,startsOn,endsOn,cleanText(req.body?.heroImage,500) || null]);
    res.status(201).json({ id: (result as ResultSetHeader).insertId });
  } catch (error) { next(error); }
});

adminApi.put("/programs/:id", requireAdmin, async (req, res, next) => {
  try {
    const title = cleanText(req.body?.title, 180);
    const slug = slugify(cleanText(req.body?.slug || title, 180));
    const status = req.body?.status === "published" ? "published" : "draft";
    const startsOn = req.body?.startsOn || null;
    const endsOn = req.body?.endsOn || null;
    if (!title || !slug || !validDate(startsOn) || !validDate(endsOn) || (startsOn && endsOn && endsOn < startsOn)) { res.status(400).json({ error: "Check the required fields and date range." }); return; }
    const [result] = await pool.execute("UPDATE cms_programs SET slug=?,title=?,summary=?,description=?,status=?,starts_on=?,ends_on=?,hero_image=? WHERE id=?", [slug,title,cleanText(req.body?.summary,500),cleanText(req.body?.description),status,startsOn,endsOn,cleanText(req.body?.heroImage,500) || null,Number(req.params.id)]);
    if (!(result as mysql.ResultSetHeader).affectedRows) { res.status(404).json({ error: "Program not found." }); return; }
    res.json({ ok: true });
  } catch (error) { next(error); }
});

adminApi.delete("/programs/:id", requireAdmin, async (req, res, next) => {
  try {
    await pool.execute("DELETE FROM cms_programs WHERE id=?", [Number(req.params.id)]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

adminApi.post("/activities", requireAdmin, async (req, res, next) => {
  try {
    const title = cleanText(req.body?.title, 180);
    const activityDate = req.body?.activityDate || null;
    const programId = req.body?.programId ? Number(req.body.programId) : null;
    if (!title || !validDate(activityDate) || (programId !== null && (!Number.isInteger(programId) || programId < 1))) { res.status(400).json({ error: "Enter a title and valid date/program." }); return; }
    const [result] = await pool.execute("INSERT INTO cms_activities(program_id,title,activity_date,location,summary,description,status,image_path) VALUES(?,?,?,?,?,?,?,?)", [programId,title,activityDate,cleanText(req.body?.location,180),cleanText(req.body?.summary,500),cleanText(req.body?.description),req.body?.status === "published" ? "published" : "draft",cleanText(req.body?.imagePath,500) || null]);
    res.status(201).json({ id: (result as ResultSetHeader).insertId });
  } catch (error) { next(error); }
});

adminApi.put("/activities/:id", requireAdmin, async (req, res, next) => {
  try {
    const title = cleanText(req.body?.title, 180);
    const activityDate = req.body?.activityDate || null;
    const programId = req.body?.programId ? Number(req.body.programId) : null;
    if (!title || !validDate(activityDate) || (programId !== null && (!Number.isInteger(programId) || programId < 1))) { res.status(400).json({ error: "Check the title, date, and program." }); return; }
    await pool.execute("UPDATE cms_activities SET program_id=?,title=?,activity_date=?,location=?,summary=?,description=?,status=?,image_path=? WHERE id=?", [programId,title,activityDate,cleanText(req.body?.location,180),cleanText(req.body?.summary,500),cleanText(req.body?.description),req.body?.status === "published" ? "published" : "draft",cleanText(req.body?.imagePath,500) || null,Number(req.params.id)]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

adminApi.delete("/activities/:id", requireAdmin, async (req, res, next) => {
  try { await pool.execute("DELETE FROM cms_activities WHERE id=?", [Number(req.params.id)]); res.json({ ok: true }); }
  catch (error) { next(error); }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 }, fileFilter: (_req: Request, file: { mimetype: string }, cb: (error: Error | null, acceptFile?: boolean) => void) => {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype)) return cb(new Error("Upload a JPEG, PNG, WebP, or AVIF image."));
  cb(null, true);
} });

adminApi.get("/media", requireAdmin, async (_req, res, next) => {
  try { const [rows] = await pool.query("SELECT id,original_name,path,alt_text,width,height,bytes,created_at FROM cms_media ORDER BY id DESC"); res.json({ media: rows }); }
  catch (error) { next(error); }
});

adminApi.post("/media", requireAdmin, upload.single("image"), async (req, res, next) => {
  try {
    const uploadedFile = (req as Request & { file?: { buffer: Buffer; originalname: string } }).file;
    if (!uploadedFile) { res.status(400).json({ error: "Choose an image to upload." }); return; }
    const metadata = await sharp(uploadedFile.buffer, { limitInputPixels: 40000000 }).rotate().resize({ width: 2400, height: 1800, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toBuffer({ resolveWithObject: true });
    await fs.mkdir(mediaPath, { recursive: true });
    const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.webp`;
    await fs.writeFile(path.join(mediaPath, filename), metadata.data, { flag: "wx", mode: 0o640 });
    const mediaUrl = `/media/${filename}`;
    const [result] = await pool.execute("INSERT INTO cms_media(original_name,path,alt_text,width,height,bytes) VALUES(?,?,?,?,?,?)", [path.basename(uploadedFile.originalname).slice(0,240),mediaUrl,cleanText(req.body?.altText,300),metadata.info.width,metadata.info.height,metadata.info.size]);
    res.status(201).json({ id: (result as ResultSetHeader).insertId, path: mediaUrl, width: metadata.info.width, height: metadata.info.height });
  } catch (error) { next(error); }
});

adminApi.put("/media/:id", requireAdmin, async (req, res, next) => {
  try { await pool.execute("UPDATE cms_media SET alt_text=? WHERE id=?", [cleanText(req.body?.altText,300),Number(req.params.id)]); res.json({ ok: true }); }
  catch (error) { next(error); }
});

adminApi.get("/image-slots", requireAdmin, async (_req, res, next) => {
  try { const [rows] = await pool.query("SELECT slot_key,media_id,alt_text FROM cms_image_slots ORDER BY slot_key"); res.json({ slots: rows }); }
  catch (error) { next(error); }
});

adminApi.put("/image-slots/:key", requireAdmin, async (req, res, next) => {
  try {
    const key = cleanText(req.params.key,120);
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(key)) { res.status(400).json({ error: "Invalid image slot." }); return; }
    const mediaId = req.body?.mediaId ? Number(req.body.mediaId) : null;
    await pool.execute("INSERT INTO cms_image_slots(slot_key,media_id,alt_text) VALUES(?,?,?) ON DUPLICATE KEY UPDATE media_id=VALUES(media_id),alt_text=VALUES(alt_text)", [key,mediaId,cleanText(req.body?.altText,300)]);
    res.json({ ok: true });
  } catch (error) { next(error); }
});

app.use("/api/admin", adminApi);

app.get("/api/health", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store, private");
  try { await pool.query("SELECT 1"); res.json({ ok: true, database: "connected" }); }
  catch { res.status(503).json({ ok: false, database: "unavailable" }); }
});

app.get("/api/programs", async (_req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  try {
    const [programRows] = await pool.query("SELECT p.id,p.slug,p.title,p.summary,p.description,p.starts_on,p.ends_on,p.hero_image,m.alt_text AS hero_alt FROM cms_programs p LEFT JOIN cms_media m ON m.path=p.hero_image WHERE p.status='published' ORDER BY p.starts_on DESC,p.id DESC");
    const [activityRows] = await pool.query("SELECT a.id,a.program_id,a.title,a.activity_date,a.location,a.summary,a.description,a.image_path,m.alt_text AS image_alt FROM cms_activities a LEFT JOIN cms_media m ON m.path=a.image_path WHERE a.status='published' ORDER BY a.activity_date DESC,a.id DESC");
    const activities = activityRows as Record<string, unknown>[];
    const programs = (programRows as Record<string, unknown>[]).map((program) => ({ ...program, activities: activities.filter((activity) => activity.program_id === program.id) }));
    res.json({ programs, standaloneActivities: activities.filter((activity) => activity.program_id === null) });
  } catch (error) { next(error); }
});

app.get("/api/site-images", async (_req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  try {
    const [rows] = await pool.query("SELECT s.slot_key,m.path,s.alt_text FROM cms_image_slots s JOIN cms_media m ON m.id=s.media_id");
    res.json({ images: Object.fromEntries((rows as { slot_key: string; path: string; alt_text: string }[]).map((row) => [row.slot_key, { src: row.path, alt: row.alt_text }])) });
  } catch (error) { next(error); }
});

app.use("/media", express.static(mediaPath, { maxAge: "7d", immutable: false, fallthrough: false, setHeaders: (res) => res.setHeader("Cache-Control", "public, max-age=604800, must-revalidate") }));
app.use(express.static(staticPath, { index: false, maxAge: "1h", setHeaders: (res, filePath) => {
  if (filePath.includes(`${path.sep}assets${path.sep}`) && /-[\w-]{6,}\.(js|css|woff2?)$/i.test(filePath)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  else if (/\.html?$/i.test(filePath)) res.setHeader("Cache-Control", "no-cache, must-revalidate");
} }));
app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  res.sendFile(path.join(staticPath, "index.html"));
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Request failed", error);
  if (res.headersSent) return;
  const message = error instanceof Error && error.message.startsWith("Upload a ") ? error.message : "The request could not be completed. Check server configuration and try again.";
  res.status(error instanceof multer.MulterError ? 413 : 500).json({ error: message });
});

const port = Number(process.env.PORT || 3001);
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => console.log(`Clean Heights app listening on ${port}`));
}

export default app;
