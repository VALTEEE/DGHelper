const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(__dirname, "..", "..", "database");
const dbPath = path.join(dbDir, "app.db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_bags (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    owned_discs TEXT NOT NULL DEFAULT '[]',
    bags TEXT NOT NULL DEFAULT '[]',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Add new columns to users if they don't exist yet.
// SQLite doesn't support "ADD COLUMN IF NOT EXISTS" so we use a try/catch.
const addColumns = [
  "ALTER TABLE users ADD COLUMN username TEXT",
  "ALTER TABLE users ADD COLUMN throw_distance INTEGER DEFAULT 0",
  "ALTER TABLE users ADD COLUMN throw_handedness TEXT DEFAULT 'right'",
];

for (const sql of addColumns) {
  try {
    db.exec(sql);
  } catch {
    // Column already exists — safe to ignore
  }
}

module.exports = db;