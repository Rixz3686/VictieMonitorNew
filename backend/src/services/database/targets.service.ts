import db from "../../config/database";
import type { Target } from "../../types";

const findByTeamIdStmt = db.query("SELECT * FROM targets WHERE team_id = $t");
const findByIdStmt = db.query("SELECT * FROM targets WHERE id = $id AND team_id = $t");
const findAllStmt = db.query("SELECT * FROM targets");
const findDueTargetsStmt = db.query("SELECT * FROM targets WHERE next_check_at <= $now");
const updateNextCheckTimeStmt = db.query("UPDATE targets SET next_check_at = $next WHERE id = $id");

const createTargetStmt = db.query(
  "INSERT INTO targets (id, team_id, name, host, port, protocol, interval_seconds, next_check_at) VALUES ($id, $t, $n, $h, $p, $pr, $i, $next)"
);

const deletePingHistoryStmt = db.query("DELETE FROM ping_history WHERE target_id = $id");
const deleteIncidentLogsStmt = db.query("DELETE FROM incident_logs WHERE target_id = $id");
const deleteTargetStmt = db.query("DELETE FROM targets WHERE id = $id AND team_id = $t");

const updateStatusStmt = db.query(
  "UPDATE targets SET current_status = $status, latency_ms = $latency WHERE id = $id"
);

const insertPingHistoryStmt = db.query(
  "INSERT INTO ping_history (id, target_id, status, latency_ms) VALUES ($id, $t, $s, $l)"
);

const prunePingHistoryStmt = db.query(
  `DELETE FROM ping_history
   WHERE id IN (
     SELECT id FROM ping_history
     WHERE target_id = $t
     ORDER BY checked_at DESC
     LIMIT -1 OFFSET $limit
   )`
);

const pruneAllPingHistoryStmt = db.query(`
  DELETE FROM ping_history
  WHERE id IN (
    SELECT id FROM (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY target_id ORDER BY checked_at DESC) as rn
      FROM ping_history
    ) WHERE rn > $limit
  )
`);

const insertIncidentLogStmt = db.query(
  "INSERT INTO incident_logs (id, target_id, status, error_reason, error_details) VALUES ($id, $t, $s, $r, $d)"
);

const getIncidentLogsByTargetStmt = db.query(
  `SELECT l.id, l.target_id, l.status, l.error_reason, l.error_details, l.created_at
   FROM incident_logs l
   JOIN targets t ON l.target_id = t.id
   WHERE l.target_id = $t AND t.team_id = $teamId
   ORDER BY l.created_at DESC`
);

const getPingHistoryStmt = db.query(
  "SELECT h.* FROM ping_history h JOIN targets t ON h.target_id = t.id WHERE h.target_id = $t AND t.team_id = $teamId ORDER BY h.checked_at ASC"
);

export const targetsService = {
  findByTeamId(teamId: string): Target[] {
    return findByTeamIdStmt.all({ $t: teamId }) as Target[];
  },

  findById(targetId: string, teamId: string): Target | null {
    return findByIdStmt.get({ $id: targetId, $t: teamId }) as Target | null;
  },

  findAll(): Target[] {
    return findAllStmt.all() as Target[];
  },

  findDueTargets(now: number): Target[] {
    return findDueTargetsStmt.all({ $now: now }) as Target[];
  },

  updateNextCheckTime(targetId: string, nextCheckAt: number): void {
    updateNextCheckTimeStmt.run({ $next: nextCheckAt, $id: targetId });
  },

  create(data: {
    id: string;
    teamId: string;
    name: string;
    host: string;
    port: number | null;
    protocol: string;
    intervalSeconds: number;
  }): void {
    db.transaction(() => {
      createTargetStmt.run({
        $id: data.id,
        $t: data.teamId,
        $n: data.name,
        $h: data.host,
        $p: data.port,
        $pr: data.protocol,
        $i: data.intervalSeconds,
        $next: Date.now(),
      });
      insertIncidentLogStmt.run({
        $id: crypto.randomUUID(),
        $t: data.id,
        $s: "START",
        $r: null,
        $d: null,
      });
    })();
  },

  update(
    targetId: string,
    teamId: string,
    updates: {
      name?: string;
      host?: string;
      port?: number | null;
      protocol?: string;
      intervalSeconds?: number;
    }
  ): void {
    const setClauses: string[] = [];
    const params: Record<string, any> = { $id: targetId, $t: teamId };

    if (updates.name !== undefined) {
      setClauses.push("name = $n");
      params.$n = updates.name;
    }
    if (updates.host !== undefined) {
      setClauses.push("host = $h");
      params.$h = updates.host;
    }
    if (updates.port !== undefined) {
      setClauses.push("port = $p");
      params.$p = updates.port;
    }
    if (updates.protocol !== undefined) {
      setClauses.push("protocol = $pr");
      params.$pr = updates.protocol;
    }
    if (updates.intervalSeconds !== undefined) {
      setClauses.push("interval_seconds = $i");
      params.$i = updates.intervalSeconds;
      
      setClauses.push("next_check_at = $next");
      params.$next = Date.now();
    }

    if (setClauses.length > 0) {
      db.query(
        `UPDATE targets SET ${setClauses.join(", ")} WHERE id = $id AND team_id = $t`
      ).run(params);
    }
  },

  delete(targetId: string, teamId: string): void {
    db.transaction(() => {
      deletePingHistoryStmt.run({ $id: targetId });
      deleteIncidentLogsStmt.run({ $id: targetId });
      deleteTargetStmt.run({ $id: targetId, $t: teamId });
    })();
  },

  updateStatus(targetId: string, status: string, latency: number): void {
    updateStatusStmt.run({
      $status: status,
      $latency: latency,
      $id: targetId,
    });
  },

  insertPingHistory(targetId: string, status: string, latency: number): void {
    insertPingHistoryStmt.run({
      $id: crypto.randomUUID(),
      $t: targetId,
      $s: status,
      $l: latency,
    });
  },

  prunePingHistory(targetId: string, limit: number = 360): void {
    prunePingHistoryStmt.run({ $t: targetId, $limit: limit });
  },

  pruneAllPingHistory(limit: number = 360): void {
    pruneAllPingHistoryStmt.run({ $limit: limit });
  },

  insertIncidentLog(targetId: string, status: string, reason?: string | null, details?: string | null): void {
    insertIncidentLogStmt.run({
      $id: crypto.randomUUID(),
      $t: targetId,
      $s: status,
      $r: reason || null,
      $d: details || null,
    });
  },

  getIncidentLogsByTarget(targetId: string, teamId: string) {
    return getIncidentLogsByTargetStmt.all({ $t: targetId, $teamId: teamId });
  },

  getPingHistory(targetId: string, teamId: string) {
    return getPingHistoryStmt.all({ $t: targetId, $teamId: teamId });
  },
};
