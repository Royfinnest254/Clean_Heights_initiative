import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Use dist/public for production, which is where Vite builds to
const staticPath = path.resolve(__dirname, "public");

app.use(express.static(staticPath));

// Handle client-side routing - serve index.html for all routes
app.get("*", (req, res) => {
  // Check if it's an API route or something else before falling back to index.html
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "Not found" });
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

async function startServer() {
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Only start the server if we're not being imported (e.g., in a serverless function)
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  startServer().catch(console.error);
}

export default app;
