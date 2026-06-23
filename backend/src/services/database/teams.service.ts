import db from "../../config/database";
import type { Team } from "../../types";

export const teamsService = {
  findByUserId(userId: string) {
    return db
      .query(
        `SELECT t.id, t.name, tm.role 
         FROM teams t 
         JOIN team_members tm ON t.id = tm.team_id 
         WHERE tm.user_id = $userId`
      )
      .all({ $userId: userId });
  },

  findById(teamId: string): Team | null {
    return db
      .query("SELECT * FROM teams WHERE id = $id")
      .get({ $id: teamId }) as Team | null;
  },

  create(id: string, name: string, userId: string): void {
    db.transaction(() => {
      db.query("INSERT INTO teams (id, name) VALUES ($id, $name)").run({
        $id: id,
        $name: name,
      });
      db.query(
        "INSERT INTO team_members (team_id, user_id, role) VALUES ($t, $u, 'ADMIN')"
      ).run({ $t: id, $u: userId });
    })();
  },

  delete(teamId: string): void {
    db.transaction(() => {
      db.query(
        "DELETE FROM ping_history WHERE target_id IN (SELECT id FROM targets WHERE team_id = $t)"
      ).run({ $t: teamId });
      db.query(
        "DELETE FROM incident_logs WHERE target_id IN (SELECT id FROM targets WHERE team_id = $t)"
      ).run({ $t: teamId });
      db.query("DELETE FROM targets WHERE team_id = $t").run({ $t: teamId });
      db.query("DELETE FROM team_members WHERE team_id = $t").run({
        $t: teamId,
      });
      db.query("DELETE FROM teams WHERE id = $t").run({ $t: teamId });
    })();
  },

  getMemberRole(teamId: string, userId: string): { role: string } | null {
    return db
      .query(
        "SELECT role FROM team_members WHERE team_id = $t AND user_id = $u"
      )
      .get({ $t: teamId, $u: userId }) as { role: string } | null;
  },

  isMember(teamId: string, userId: string): boolean {
    const result = db
      .query("SELECT 1 FROM team_members WHERE team_id = $t AND user_id = $u")
      .get({ $t: teamId, $u: userId });
    return !!result;
  },

  getLogs(teamId: string, limit: number = 100) {
    return db
      .query(
        `SELECT l.id, t.name as target_name, t.host as target_host, t.protocol as target_protocol, l.status, l.created_at 
         FROM incident_logs l 
         JOIN targets t ON l.target_id = t.id 
         WHERE t.team_id = $teamId 
         ORDER BY l.created_at DESC 
         LIMIT $limit`
      )
      .all({ $teamId: teamId, $limit: limit });
  },

  clearLogs(teamId: string): void {
    db.query(
      `DELETE FROM incident_logs 
       WHERE target_id IN (SELECT id FROM targets WHERE team_id = $teamId)`
    ).run({ $teamId: teamId });
  },
};
