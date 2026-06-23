import { teamsService } from "../services/database/teams.service";
import { ForbiddenError, NotFoundError } from "../utils/errors";

export const teamsController = {
  async createTeam(name: string, userId: string) {
    const teamId = crypto.randomUUID();
    teamsService.create(teamId, name, userId);
    return { teamId };
  },

  async getTeams(userId: string) {
    const teams = teamsService.findByUserId(userId);
    return { teams };
  },

  async deleteTeam(teamId: string, userId: string) {
    const membership = teamsService.getMemberRole(teamId, userId);
    if (!membership) {
      throw new NotFoundError("Anda bukan anggota tim ini");
    }
    if (membership.role !== "ADMIN") {
      throw new ForbiddenError("Hanya ADMIN yang dapat menghapus tim");
    }
    teamsService.delete(teamId);
    return { message: "Tim berhasil dihapus" };
  },
};
