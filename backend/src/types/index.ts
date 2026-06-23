// ─── JWT ─────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  id: string;
  email: string;
  exp?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElysiaJwtClaims = Record<string, any>;

export interface JwtToken {
  verify: (token?: string) => Promise<false | ElysiaJwtClaims>;
  sign: (payload: ElysiaJwtClaims) => Promise<string>;
}

export interface ElysiaSet {
  status?: number | string;
  redirect?: string;
  [key: string]: unknown;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  password_hash: string;
  otp_code?: string;
  otp_expires_at?: Date;
  last_active?: Date;
}

export interface Team {
  id: string;
  name: string;
  created_at: Date;
}

export interface Target {
  id: string;
  team_id: string;
  name: string;
  host: string;
  port?: number | null;
  protocol: "HTTP" | "HTTPS" | "TCP" | "ICMP";
  interval_seconds?: number;
  current_status?: "UP" | "DOWN" | "UNKNOWN";
  latency_ms?: number;
  created_at?: Date;
}

export interface IncidentLog {
  id: string;
  target_id: string;
  status: "UP" | "DOWN";
  created_at: Date;
}

export interface PingHistory {
  id: string;
  target_id: string;
  status: "UP" | "DOWN";
  latency_ms: number;
  checked_at: Date;
}
