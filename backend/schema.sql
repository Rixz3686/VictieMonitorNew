CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  otp_code TEXT,
  otp_expires_at DATETIME,
  last_active DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  team_id TEXT,
  user_id TEXT,
  role TEXT,
  PRIMARY KEY (team_id, user_id)
);

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
);

CREATE TABLE IF NOT EXISTS incident_logs (
  id TEXT PRIMARY KEY,
  target_id TEXT,
  status TEXT,
  error_reason TEXT,
  error_details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ping_history (
  id TEXT PRIMARY KEY,
  target_id TEXT,
  status TEXT,
  latency_ms INTEGER,
  checked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ping_history_target_id ON ping_history(target_id, checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_incident_logs_target_id ON incident_logs(target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_targets_next_check ON targets(next_check_at);
