import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import archiver from "archiver";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const release = path.join(root, "namecheap-php", "release");
const zipPath = path.join(root, "namecheap-php", "Clean_Heights_Namecheap_Upload.zip");
const builtPublic = path.join(root, "dist", "public");
const sourcePublic = path.join(root, "client", "public");
const phpSource = path.join(root, "namecheap-php");

const within = (base, candidate) => candidate === base || candidate.startsWith(`${base}${path.sep}`);
if (!within(path.join(root, "namecheap-php"), release)) throw new Error("Unsafe release staging path.");
await fs.rm(release, { recursive: true, force: true });
await fs.mkdir(release, { recursive: true });
await fs.access(path.join(builtPublic, "index.html"));

async function copyTree(source, destination, { optimizeImages = false } = {}) {
  await fs.mkdir(destination, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (entry.name === "__manus__" || entry.name === ".htaccess") continue;
    const from = path.join(source, entry.name);
    if (entry.isDirectory()) {
      await copyTree(from, path.join(destination, entry.name), { optimizeImages });
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (optimizeImages && [".jpg", ".jpeg", ".png"].includes(ext)) {
      const target = path.join(destination, `${entry.name.slice(0, -ext.length)}.webp`);
      await sharp(from, { limitInputPixels: 40000000 })
        .rotate()
        .resize({ width: 1040, height: 780, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 58, effort: 6, smartSubsample: true })
        .toFile(target);
    } else {
      await fs.copyFile(from, path.join(destination, entry.name));
    }
  }
}

// Built app, original public files, and PHP API all land at the document root.
await copyTree(builtPublic, release);
// Vite copies public images into its build output; remove those originals so
// the release contains only the optimized derivatives copied from source.
async function removeOriginalPhotos(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) await removeOriginalPhotos(file);
    else if ([".jpg", ".jpeg", ".png"].includes(path.extname(entry.name).toLowerCase())) await fs.rm(file, { force: true });
  }
}
await removeOriginalPhotos(release);
await copyTree(sourcePublic, release, { optimizeImages: true });
const logoSvg = await fs.readFile(path.join(sourcePublic, "chi-logo.svg"));
await sharp(logoSvg).resize(192, 192, { fit: "contain", background: "#ffffff" }).png({ compressionLevel: 9 }).toFile(path.join(release, "favicon.png"));
await sharp(logoSvg).resize(180, 180, { fit: "contain", background: "#ffffff" }).png({ compressionLevel: 9 }).toFile(path.join(release, "apple-touch-icon.png"));
await fs.copyFile(path.join(phpSource, ".htaccess"), path.join(release, ".htaccess"));
await fs.copyFile(path.join(phpSource, ".user.ini"), path.join(release, ".user.ini"));
await fs.copyFile(path.join(phpSource, "cms-config.example.php"), path.join(release, "cms-config.example.php"));
await fs.copyFile(path.join(phpSource, "news-route.php"), path.join(release, "news-route.php"));
await fs.copyFile(path.join(phpSource, "sitemap-route.php"), path.join(release, "sitemap-route.php"));
await fs.mkdir(path.join(release, "api"), { recursive: true });
await fs.copyFile(path.join(phpSource, "api", "index.php"), path.join(release, "api", "index.php"));
await fs.mkdir(path.join(release, "media"), { recursive: true });
await fs.copyFile(path.join(phpSource, "media", ".htaccess"), path.join(release, "media", ".htaccess"));
await fs.mkdir(path.join(release, "data"), { recursive: true });
await fs.copyFile(path.join(phpSource, "data", "news-import.json"), path.join(release, "data", "news-import.json"));
await fs.copyFile(path.join(phpSource, "data", ".htaccess"), path.join(release, "data", ".htaccess"));
await copyTree(path.join(phpSource, "news-media"), path.join(release, "news-media"));

async function listPhotos(dir, prefix = "") {
  const photos = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === "media" || entry.name === "data" || entry.name === "news-media") continue;
    const file = path.join(dir, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) photos.push(...await listPhotos(file, relative));
    else if (/\.(webp|avif)$/i.test(entry.name)) photos.push({ path: `/${relative.replaceAll("\\", "/")}`, name: entry.name });
  }
  return photos;
}
await fs.writeFile(path.join(release, "site-image-manifest.json"), JSON.stringify(await listPhotos(release), null, 2));

const pageSeo = {
  "/": ["Community Conservation in Iten, Kenya | Clean Heights Initiative", "Clean Heights Initiative is a community-led environmental organization in Iten, Elgeyo Marakwet, Kenya. Learn about our local ecosystem restoration, water-source protection, youth, and community work.", "/hero-bg.webp"],
  "/about": ["About Clean Heights Initiative | Our Mission and Community Work", "Meet Clean Heights Initiative, a grassroots organization based in Iten, Kenya, working with communities on environmental restoration, water protection, and local stewardship.", "/founder-portrait.webp"],
  "/team": ["Our Team | Clean Heights Initiative, Iten Kenya", "Meet the people working with Clean Heights Initiative on community-led environmental action in Elgeyo Marakwet, Kenya.", "/founder-portrait.webp"],
  "/programs": ["Programs and Activities | Clean Heights Initiative", "Explore Clean Heights Initiative programs and community activities in Iten and Elgeyo Marakwet, Kenya, including local environmental and water-source work.", "/hero-bg.webp"],
  "/news": ["Latest News and Community Stories | Clean Heights Initiative", "Read field updates and community stories from Clean Heights Initiative in Iten, Elgeyo Marakwet, Kenya.", "/hero-bg.webp"],
  "/milestones": ["Community Field Work and Milestones | Clean Heights Initiative", "See documented community activities and field milestones from Clean Heights Initiative in Iten and Elgeyo Marakwet, Kenya.", "/hero-bg.webp"],
  "/contact": ["Contact Clean Heights Initiative | Iten, Kenya", "Contact Clean Heights Initiative in Iten, Elgeyo Marakwet, Kenya, to ask about our community environmental work, partnerships, or activities.", "/hero-bg.webp"],
  "/ecotourism": ["Community Eco-tourism | Clean Heights Initiative", "Learn about Clean Heights Initiative's community eco-tourism and conservation work around the Elgeyo Escarpment in Kenya.", "/milestones/escarpment/eco-planting.webp"],
  "/privacy": ["Privacy Notice | Clean Heights Initiative", "Read the Clean Heights Initiative website privacy notice and learn how to contact us with questions.", "/hero-bg.webp"],
  "/cookies": ["Cookie and Browser Storage Notice | Clean Heights Initiative", "Read about browser storage and cookies used by the Clean Heights Initiative website.", "/hero-bg.webp"],
  "/terms": ["Terms of Use | Clean Heights Initiative", "Read the terms for using the Clean Heights Initiative website.", "/hero-bg.webp"],
  "/accessibility": ["Accessibility Statement | Clean Heights Initiative", "Read the Clean Heights Initiative accessibility statement and how to report a website access barrier.", "/hero-bg.webp"],
  "/admin": ["Content Portal | Clean Heights Initiative", "Restricted content management sign-in.", "/hero-bg.webp", true],
  "/admin/setup": ["Administrator Setup | Clean Heights Initiative", "Restricted administrator setup and recovery.", "/hero-bg.webp", true],
};

function escapeHtml(text) { return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]); }
function replaceMeta(html, pattern, replacement) { return pattern.test(html) ? html.replace(pattern, replacement) : html.replace("</head>", `  ${replacement}\n</head>`); }
for (const [route, [title, description, image, noIndex]] of Object.entries(pageSeo)) {
  const folder = path.join(release, route.replace(/^\//, ""));
  const output = route === "/" ? path.join(release, "index.html") : path.join(folder, "index.html");
  let html = await fs.readFile(path.join(release, "index.html"), "utf8");
  const canonical = `https://cleanheightsinitiative.org${route === "/" ? "/" : route}`;
  const absoluteImage = `https://cleanheightsinitiative.org${image}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}" />`);
  html = replaceMeta(html, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${absoluteImage}" />`);
  html = replaceMeta(html, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}" />`);
  if (noIndex) html = replaceMeta(html, /<meta\s+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,nofollow" />');
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, html, "utf8");
}

// Keep the existing route strings in the React bundle and JSON, while serving
// optimized WebP derivatives from the release archive.
async function rewriteImageReferences(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { await rewriteImageReferences(file); continue; }
    if (!/\.(html?|js|css|json|xml|txt|webmanifest|svg)$/i.test(entry.name)) continue;
    if (entry.name === "news-import.json") continue; // Preserve legacy blog image URLs as stored.
    const original = await fs.readFile(file, "utf8");
    const updated = original.replace(/([A-Za-z0-9_-]+)\.(?:jpe?g|png)\b/gi, (match, base) => /^(favicon|apple-touch-icon)$/i.test(base) ? match : `${base}.webp`);
    if (updated !== original) await fs.writeFile(file, updated, "utf8");
  }
}
await rewriteImageReferences(release);

const stream = (await import("node:fs")).createWriteStream(zipPath);
const archive = archiver("zip", { zlib: { level: 9 } });
await new Promise((resolve, reject) => {
  stream.on("close", resolve);
  stream.on("error", reject);
  archive.on("error", reject);
  archive.pipe(stream);
  archive.directory(release, false);
  archive.finalize();
});
console.log(`Namecheap upload ZIP: ${zipPath}`);
console.log(`Archive size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MiB`);
