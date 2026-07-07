import { teamsService } from "../services/database/teams.service";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export const teamsController = {
  async createTeam(name: string, userId: string) {
    const teamId = crypto.randomUUID();
    await teamsService.create(teamId, name, userId);
    return { teamId };
  },

  async getTeams(userId: string) {
    const teams = await teamsService.findByUserId(userId);
    return { teams };
  },

  async deleteTeam(teamId: string, userId: string) {
    const membership = await teamsService.getMemberRole(teamId, userId);
    if (!membership) {
      throw new NotFoundError("Anda bukan anggota tim ini");
    }
    if (membership.role !== "ADMIN") {
      throw new ForbiddenError("Hanya ADMIN yang dapat menghapus tim");
    }
    await teamsService.delete(teamId);
    return { message: "Tim berhasil dihapus" };
  },
};
