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
  async findByTeamId(teamId: string): Promise<Target[]> {
    return await findByTeamIdStmt.all({ $t: teamId }) as Target[];
  },

  async findById(targetId: string, teamId: string): Promise<Target | null> {
    return (await findByIdStmt.get({ $id: targetId, $t: teamId })) as Target | null;
  },

  async findAll(): Promise<Target[]> {
    return await findAllStmt.all() as Target[];
  },

  async findDueTargets(now: number): Promise<Target[]> {
    return await findDueTargetsStmt.all({ $now: now }) as Target[];
  },

  async updateNextCheckTime(targetId: string, nextCheckAt: number): Promise<void> {
    await updateNextCheckTimeStmt.run({ $next: nextCheckAt, $id: targetId });
  },

  async create(data: {
    id: string;
    teamId: string;
    name: string;
    host: string;
    port: number | null;
    protocol: string;
    intervalSeconds: number;
  }): Promise<void> {
    await db.batch([
      createTargetStmt.raw({
        $id: data.id,
        $t: data.teamId,
        $n: data.name,
        $h: data.host,
        $p: data.port,
        $pr: data.protocol,
        $i: data.intervalSeconds,
        $next: Date.now(),
      }),
      insertIncidentLogStmt.raw({
        $id: crypto.randomUUID(),
        $t: data.id,
        $s: "START",
        $r: null,
        $d: null,
      })
    ]);
  },

  async update(
    targetId: string,
    teamId: string,
    updates: {
      name?: string;
      host?: string;
      port?: number | null;
      protocol?: string;
      intervalSeconds?: number;
    }
  ): Promise<void> {
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
      await db.query(
        `UPDATE targets SET ${setClauses.join(", ")} WHERE id = $id AND team_id = $t`
      ).run(params);
    }
  },

  async delete(targetId: string, teamId: string): Promise<void> {
    await db.batch([
      deletePingHistoryStmt.raw({ $id: targetId }),
      deleteIncidentLogsStmt.raw({ $id: targetId }),
      deleteTargetStmt.raw({ $id: targetId, $t: teamId })
    ]);
  },

  async updateStatus(targetId: string, status: string, latency: number): Promise<void> {
    await updateStatusStmt.run({
      $status: status,
      $latency: latency,
      $id: targetId,
    });
  },

  async insertPingHistory(targetId: string, status: string, latency: number): Promise<void> {
    await insertPingHistoryStmt.run({
      $id: crypto.randomUUID(),
      $t: targetId,
      $s: status,
      $l: latency,
    });
  },

  async prunePingHistory(targetId: string, limit: number = 360): Promise<void> {
    await prunePingHistoryStmt.run({ $t: targetId, $limit: limit });
  },

  async pruneAllPingHistory(limit: number = 360): Promise<void> {
    await pruneAllPingHistoryStmt.run({ $limit: limit });
  },

  async insertIncidentLog(targetId: string, status: string, reason?: string | null, details?: string | null): Promise<void> {
    await insertIncidentLogStmt.run({
      $id: crypto.randomUUID(),
      $t: targetId,
      $s: status,
      $r: reason || null,
      $d: details || null,
    });
  },

  async getIncidentLogsByTarget(targetId: string, teamId: string) {
    return await getIncidentLogsByTargetStmt.all({ $t: targetId, $teamId: teamId });
  },

  async getPingHistory(targetId: string, teamId: string) {
    return await getPingHistoryStmt.all({ $t: targetId, $teamId: teamId });
  },
};
