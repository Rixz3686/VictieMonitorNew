import db from "../../config/database";
import type { Team } from "../../types";

export const teamsService = {
  async findByUserId(userId: string) {
    return await db
      .query(
        `SELECT t.id, t.name, tm.role 
         FROM teams t 
         JOIN team_members tm ON t.id = tm.team_id 
         WHERE tm.user_id = $userId`
      )
      .all({ $userId: userId });
  },

  async findById(teamId: string): Promise<Team | null> {
    return (await db
      .query("SELECT * FROM teams WHERE id = $id")
      .get({ $id: teamId })) as Team | null;
  },

  async create(id: string, name: string, userId: string): Promise<void> {
    await db.batch([
      db.query("INSERT INTO teams (id, name) VALUES ($id, $name)").raw({
        $id: id,
        $name: name,
      }),
      db.query(
        "INSERT INTO team_members (team_id, user_id, role) VALUES ($t, $u, 'ADMIN')"
      ).raw({ $t: id, $u: userId })
    ]);
  },

  async delete(teamId: string): Promise<void> {
    await db.batch([
      db.query(
        "DELETE FROM ping_history WHERE target_id IN (SELECT id FROM targets WHERE team_id = $t)"
      ).raw({ $t: teamId }),
      db.query(
        "DELETE FROM incident_logs WHERE target_id IN (SELECT id FROM targets WHERE team_id = $t)"
      ).raw({ $t: teamId }),
      db.query("DELETE FROM targets WHERE team_id = $t").raw({ $t: teamId }),
      db.query("DELETE FROM team_members WHERE team_id = $t").raw({
        $t: teamId,
      }),
      db.query("DELETE FROM teams WHERE id = $t").raw({ $t: teamId })
    ]);
  },

  async getMemberRole(teamId: string, userId: string): Promise<{ role: string } | null> {
    return (await db
      .query(
        "SELECT role FROM team_members WHERE team_id = $t AND user_id = $u"
      )
      .get({ $t: teamId, $u: userId })) as { role: string } | null;
  },

  async isMember(teamId: string, userId: string): Promise<boolean> {
    const result = await db
      .query("SELECT 1 FROM team_members WHERE team_id = $t AND user_id = $u")
      .get({ $t: teamId, $u: userId });
    return !!result;
  },

  async getLogs(teamId: string, limit: number = 100) {
    return await db
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

  async clearLogs(teamId: string): Promise<void> {
    await db.query(
      `DELETE FROM incident_logs 
       WHERE target_id IN (SELECT id FROM targets WHERE team_id = $teamId)`
    ).run({ $teamId: teamId });
  },
};
