// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
}

// ─── Target ──────────────────────────────────────────────────────────────────

export interface Target {
  id: string;
  name: string;
  host: string;
  port?: number | null;
  protocol: string;
  interval_seconds?: number;
  current_status?: "UP" | "DOWN";
  latency_ms?: number;
  team_id?: string;
}

export interface TargetFormData {
  name: string;
  host: string;
  port: string;
  protocol: string;
  interval_seconds: number;
}

// ─── Logs ────────────────────────────────────────────────────────────────────

export interface LogEntry {
  id: string;
  status: string;
  target_name: string;
  target_host: string;
  target_protocol: string;
  created_at: string;
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  checked_at: string;
  latency_ms: number | null;
  status: "UP" | "DOWN";
}

export interface LatencyDataPoint {
  time: string;
  latency: number;
}

export type UptimeStatus = "UP" | "DOWN" | "NODATA";

export interface IncidentEntry {
  id: string;
  target_id: string;
  status: "UP" | "DOWN" | "START";
  error_reason: string | null;
  error_details: string | null;
  created_at: string;
}

export interface TargetPayload {
  name: string;
  host: string;
  port: number | null;
  protocol: string;
  interval_seconds: number;
}
