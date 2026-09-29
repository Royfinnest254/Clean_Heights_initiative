import mysql from "mysql2/promise";
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
try {
  for (const line of fs.readFileSync(path.join(root, ".env"), "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, "$2").replace(/\s+#.*$/, "");
  }
} catch { /* cPanel environment variables may be used instead */ }

const required = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing database environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const terminal = createInterface({ input, output });
const email = (await terminal.question("Administrator email: ")).trim().toLowerCase();
const displayName = (await terminal.question("Display name: ")).trim();
const password = await terminal.question("Password (minimum 14 characters): ");
terminal.close();

if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254 || !displayName || displayName.length > 160 || password.length < 14) {
  console.error("Enter a valid email, a display name, and a password of at least 14 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = scryptSync(password, salt, 64).toString("hex");
const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
});

try {
  await connection.execute(
    "INSERT INTO cms_admins(email,display_name,password_hash,active) VALUES(?,?,?,1) ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),password_hash=VALUES(password_hash),active=1",
    [email, displayName, `scrypt$${salt}$${derived}`],
  );
  console.log(`Administrator account created or reset for ${email}.`);
} finally {
  await connection.end();
}
