import { Database } from "bun:sqlite";

// Di production, set DATABASE_PATH ke path persistent (misal: /app/data/database.sqlite)
// Di development, default ke "database.sqlite" di folder saat ini
const DB_PATH = process.env.DATABASE_PATH || "database.sqlite";
const db = new Database(DB_PATH, { create: true });

db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA synchronous = NORMAL;");
db.exec("PRAGMA temp_store = MEMORY;");
db.exec("PRAGMA mmap_size = 30000000000;");
db.exec("PRAGMA busy_timeout = 5000;");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password_hash TEXT,
    otp_code TEXT,
    otp_expires_at DATETIME,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS team_members (
    team_id TEXT,
    user_id TEXT,
    role TEXT,
    PRIMARY KEY (team_id, user_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS targets (
    id TEXT PRIMARY KEY,
    team_id TEXT,
    name TEXT,
    host TEXT,
    port INTEGER,
    protocol TEXT,
    interval_seconds INTEGER DEFAULT 60, 
    current_status TEXT DEFAULT 'UNKNOWN',
    latency_ms INTEGER DEFAULT 0,
    next_check_at INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.run("ALTER TABLE targets ADD COLUMN next_check_at INTEGER DEFAULT 0;");
} catch (_) {
}


db.run(`
  CREATE TABLE IF NOT EXISTS incident_logs (
    id TEXT PRIMARY KEY,
    target_id TEXT,
    status TEXT,
    error_reason TEXT,
    error_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

try {
  db.run("ALTER TABLE incident_logs ADD COLUMN error_reason TEXT;");
} catch (_) {}
try {
  db.run("ALTER TABLE incident_logs ADD COLUMN error_details TEXT;");
} catch (_) {}

db.run(`
  CREATE TABLE IF NOT EXISTS ping_history (
    id TEXT PRIMARY KEY,
    target_id TEXT,
    status TEXT,
    latency_ms INTEGER,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.run(`CREATE INDEX IF NOT EXISTS idx_ping_history_target_id ON ping_history(target_id, checked_at DESC);`);
db.run(`CREATE INDEX IF NOT EXISTS idx_incident_logs_target_id ON incident_logs(target_id, created_at DESC);`);
db.run(`CREATE INDEX IF NOT EXISTS idx_targets_next_check ON targets(next_check_at);`);

export default db;
