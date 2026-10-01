import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const newsDir = path.join(root, "namecheap-php", "data");
const mediaDir = path.join(root, "namecheap-php", "news-media");
const feedUrl = "https://blog.cleanheightsinitiative.org/data/posts.json";
const feed = await fetch(feedUrl, { headers: { Accept: "application/json" } });
if (!feed.ok) throw new Error(`Legacy blog feed request failed (${feed.status}).`);
const posts = await feed.json();
if (!Array.isArray(posts)) throw new Error("Legacy blog feed was not a list of stories.");
await fs.rm(mediaDir, { recursive: true, force: true });
await fs.mkdir(mediaDir, { recursive: true });

async function localize(post, value, suffix) {
  if (typeof value !== "string" || !value.startsWith("images/")) return value || "";
  const filename = path.posix.basename(value);
  if (!/^[a-zA-Z0-9._-]+\.(jpe?g|png|webp|avif)$/i.test(filename)) throw new Error(`Unsafe legacy photo name: ${filename}`);
  const source = await fetch(new URL(`images/${encodeURIComponent(filename)}`, "https://blog.cleanheightsinitiative.org/"));
  if (!source.ok) throw new Error(`Could not download legacy photo ${filename} (${source.status}).`);
  const name = `story-${Number(post.id) || "legacy"}-${suffix}.webp`;
  await sharp(Buffer.from(await source.arrayBuffer()), { limitInputPixels: 40000000 })
    .rotate()
    .resize({ width: 1280, height: 960, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 68, effort: 6, smartSubsample: true })
    .toFile(path.join(mediaDir, name));
  return `/news-media/${name}`;
}

const snapshot = [];
for (const post of posts) {
  const id = Number(post.id);
  if (!post.title || !Number.isFinite(id)) continue;
  const item = {
    id,
    title: String(post.title),
    excerpt: String(post.excerpt || ""),
    author: String(post.author || "Clean Heights Initiative"),
    date: String(post.date || ""),
    category: String(post.category || "News"),
    image: await localize(post, post.image, "cover"),
    gallery: [],
    content: String(post.content || ""),
  };
  if (Array.isArray(post.gallery)) {
    for (let index = 0; index < Math.min(post.gallery.length, 20); index++) item.gallery.push(await localize(post, post.gallery[index], `gallery-${index + 1}`));
  }
  snapshot.push(item);
}
await fs.mkdir(newsDir, { recursive: true });
await fs.writeFile(path.join(newsDir, "news-import.json"), `${JSON.stringify(snapshot, null, 2)}\n`);
console.log(`Saved ${snapshot.length} live stories with optimized images to ${newsDir}`);
