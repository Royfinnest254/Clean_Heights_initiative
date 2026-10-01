import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "client", "public");
const origin = "https://cleanheightsinitiative.org";
const publicImage = (url) => {
  if (typeof url !== "string" || !url.startsWith("/") || url.startsWith("//")) return null;
  const local = path.resolve(publicDir, `.${url}`);
  if (!local.startsWith(`${publicDir}${path.sep}`) || !fs.existsSync(local) || !fs.statSync(local).isFile()) return null;
  return `${origin}${url.split("/").map((part, index) => index === 0 ? "" : encodeURIComponent(part)).join("/")}`;
};

const entries = new Map();
const addPage = (page, imagePaths = []) => {
  const images = [...new Set(imagePaths.map(publicImage).filter(Boolean))];
  entries.set(page, images);
};

addPage("/", ["/hero-bg.jpg", "/home-hero.jpeg", "/impact-field.jpg", "/impact-team.jpg", "/impact-group.jpg"]);
addPage("/about", ["/founder-portrait.jpg"]);
addPage("/team", ["/founder-portrait.jpg"]);
addPage("/milestones");
addPage("/programs");
addPage("/contact");
addPage("/news");
addPage("/privacy");
addPage("/cookies");
addPage("/terms");
addPage("/accessibility");
addPage("/ecotourism", ["/milestones/escarpment/eco-planting.jpg"]);

const milestonesPath = path.join(publicDir, "data", "milestones.json");
const milestones = JSON.parse(fs.readFileSync(milestonesPath, "utf8"));
const milestoneImages = milestones.flatMap((milestone) => [milestone.photo, ...(Array.isArray(milestone.gallery) ? milestone.gallery : [])]);
addPage("/milestones", milestoneImages);

const imageNamespace = "http://www.google.com/schemas/sitemap-image/1.1";
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="${imageNamespace}">`,
  ...[...entries].map(([route, images]) => [
    "  <url>",
    `    <loc>${origin}${route === "/" ? "/" : route}</loc>`,
    ...images.map((image) => `    <image:image><image:loc>${image}</image:loc></image:image>`),
    "  </url>",
  ].join("\n")),
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml, "utf8");
console.log(`Generated sitemap with ${entries.size} pages and ${[...entries.values()].reduce((sum, images) => sum + images.length, 0)} image references.`);
