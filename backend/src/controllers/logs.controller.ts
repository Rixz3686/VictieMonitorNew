import { teamsService } from "../services/database/teams.service";

export const logsController = {
  async getLogs(teamId: string) {
    const logs = await teamsService.getLogs(teamId, 100);
    return { logs };
  },

  async clearLogs(teamId: string) {
    await teamsService.clearLogs(teamId);
    return { message: "Seluruh log berhasil dibersihkan" };
  },
};
