import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import archiver from "archiver";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputZip = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(root, "..", "Clean_Heights_Full_Website_SEO_20260930.zip");
const stage = path.join(path.dirname(outputZip), "Clean_Heights_SEO_Full_Package_Staging");
const excluded = new Set([".git", "node_modules", "storage", ".manus-logs"]);

try {
  await fs.access(stage);
  throw new Error(`Refusing to overwrite existing staging directory: ${stage}`);
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

await fs.mkdir(stage, { recursive: true });
let photosOptimized = 0;
let photoBytesBefore = 0;
let photoBytesAfter = 0;

async function copyTree(source, destination, relative = "") {
  await fs.mkdir(destination, { recursive: true });
  for (const entry of await fs.readdir(source, { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name === ".env" || entry.name === path.basename(outputZip)) continue;
    const from = path.join(source, entry.name);
    const rel = path.join(relative, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyTree(from, to, rel);
      continue;
    }
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    const isPhoto = /^(client[\\/]public|blog_subdomain[\\/]images)[\\/]/i.test(rel) && [".jpg", ".jpeg"].includes(ext);
    if (isPhoto) {
      const before = (await fs.stat(from)).size;
      try {
        const info = await sharp(from).rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: "4:2:0" }).toFile(to);
        photosOptimized += 1;
        photoBytesBefore += before;
        photoBytesAfter += info.size;
      } catch {
        await fs.copyFile(from, to);
      }
    } else {
      await fs.copyFile(from, to);
    }
  }
}

await copyTree(root, stage);
await fs.writeFile(path.join(stage, "UPLOAD-README.txt"), `FULL WEBSITE PACKAGE — 30 September 2026\n\nThis is a full application package, not a small patch. In cPanel File Manager, upload this ZIP and extract it inside the Node.js application's configured Application Root. Do not extract it into public_html unless public_html is explicitly the Application Root in Setup Node.js App.\n\nBefore replacing files, download a backup of the current application files. Keep the hosting environment variables and the storage/media directory. This ZIP intentionally excludes .env, storage uploads, node_modules, and Git history. Do not import database/schema.sql over a database that already contains CMS data.\n\nAfter extraction, use Setup Node.js App to run NPM Install if dependencies need to be installed, then restart the application. The site must return JSON at /api/health/live before its CMS or search metadata can be considered live. A LiteSpeed 503 is a hosting/startup issue that this ZIP cannot clear by itself.\n\nExact cPanel labels can vary by account. Read CMS-NAMECHEAP-SETUP.md in this package before replacing files.\n`, "utf8");

await new Promise((resolve, reject) => {
  const output = createWriteStream(outputZip);
  const archive = archiver("zip", { zlib: { level: 9 } });
  output.on("close", resolve);
  output.on("error", reject);
  archive.on("error", reject);
  archive.pipe(output);
  archive.directory(stage, false);
  archive.finalize();
});

console.log(JSON.stringify({ outputZip, photosOptimized, photoBytesBefore, photoBytesAfter, zipBytes: (await fs.stat(outputZip)).size, stagingDirectory: stage }, null, 2));
