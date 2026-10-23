import Database from "better-sqlite3";
import { mkdirSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const migrationsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "migrations");

export function openDatabase({ databasePath, legacyStorePath = null }) {
  mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 5000");
  runMigrations(db);
  if (legacyStorePath) importLegacyInquiries(db, legacyStorePath);
  return db;
}

export function runMigrations(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    applied_at TEXT NOT NULL
  )`);

  const applied = new Set(db.prepare("SELECT version FROM schema_migrations").all().map((row) => row.version));
  const migrations = readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .map((file) => {
      const match = /^(\d+)_([\w-]+)\.sql$/.exec(file);
      if (!match) throw new Error(`Invalid migration filename: ${file}`);
      return { version: Number(match[1]), name: match[2], file };
    })
    .sort((left, right) => left.version - right.version);

  for (const migration of migrations) {
    if (applied.has(migration.version)) continue;
    const sql = readFileSync(path.join(migrationsDirectory, migration.file), "utf8");
    db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)")
        .run(migration.version, migration.name, new Date().toISOString());
    })();
  }
}

function importLegacyInquiries(db, legacyStorePath) {
  if (!existsFile(legacyStorePath)) return;
  const lines = readFileSync(legacyStorePath, "utf8").split("\n").map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return;

  const insert = db.prepare(`INSERT OR IGNORE INTO inquiries
    (id, name, email, company, service, budget, description, status, source, created_at, updated_at)
    VALUES (@id, @name, @email, @company, @service, @budget, @description, 'new', 'website', @createdAt, @updatedAt)`);

  db.transaction(() => {
    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        if (!record.id || !record.name || !record.email || !record.service || !record.description) continue;
        const timestamp = validTimestamp(record.receivedAt);
        insert.run({
          id: String(record.id),
          name: String(record.name).trim().slice(0, 120),
          email: String(record.email).trim().toLowerCase().slice(0, 180),
          company: record.company ? String(record.company).trim().slice(0, 160) : null,
          service: String(record.service).trim().slice(0, 120),
          budget: record.budget ? String(record.budget).trim().slice(0, 80) : null,
          description: String(record.description).trim().slice(0, 5000),
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      } catch {
        // A malformed legacy line is skipped; the original file remains available as a backup.
      }
    }
  })();
}

function validTimestamp(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function existsFile(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}
