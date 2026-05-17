import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root path for static files (where index.html and public/ reside)
const staticPath = path.resolve(__dirname, "public");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

const server = http.createServer((req, res) => {
  // Extract clean path (remove query params)
  const urlPath = req.url?.split("?")[0] || "/";
  
  // Resolve requested file path
  let filePath = path.join(staticPath, urlPath === "/" ? "index.html" : urlPath);

  // Simple existence check
  let exists = fs.existsSync(filePath) && fs.statSync(filePath).isFile();

  // If file doesn't exist (e.g., client-side route), fall back to index.html
  if (!exists) {
    filePath = path.join(staticPath, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Internal Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

async function startServer() {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port} (Zero-Dependency mode)`);
  });
}

// Startup
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  startServer().catch(console.error);
}

export default server;
