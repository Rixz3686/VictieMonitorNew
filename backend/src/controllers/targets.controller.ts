import { targetsService } from "../services/database/targets.service";
import { VALID_PROTOCOLS } from "../config/constants";
import { BadRequestError, NotFoundError } from "../utils/errors";

export const targetsController = {
  async getTargets(teamId: string) {
    const targets = await targetsService.findByTeamId(teamId);
    return { targets };
  },

  async createTarget(
    teamId: string,
    data: {
      name: string;
      host: string;
      port?: number | null | string;
      protocol: string;
      interval_seconds?: number;
    }
  ) {
    const protocol = data.protocol.toUpperCase();
    if (!VALID_PROTOCOLS.has(protocol)) {
      throw new BadRequestError(
        `Protokol tidak valid: ${data.protocol}. Gunakan: HTTP, HTTPS, TCP, atau ICMP.`
      );
    }

    if (
      protocol === "TCP" &&
      (data.port === undefined || data.port === null || data.port === "")
    ) {
      throw new BadRequestError("Port wajib diisi untuk protokol TCP.");
    }

    let finalPort = null;
    if (
      protocol !== "ICMP" &&
      data.port !== undefined &&
      data.port !== null &&
      data.port !== ""
    ) {
      finalPort = Number(data.port);
    }

    const id = crypto.randomUUID();
    await targetsService.create({
      id,
      teamId,
      name: data.name,
      host: data.host,
      port: finalPort,
      protocol,
      intervalSeconds:
        data.interval_seconds === undefined
          ? 60
          : Math.max(5, data.interval_seconds),
    });

    return { message: "Created", id };
  },

  async updateTarget(
    targetId: string,
    teamId: string,
    data: {
      name?: string;
      host?: string;
      port?: number | null | string;
      protocol?: string;
      interval_seconds?: number;
    }
  ) {
    if (data.protocol) {
      const protocol = data.protocol.toUpperCase();
      if (!VALID_PROTOCOLS.has(protocol)) {
        throw new BadRequestError(
          `Protokol tidak valid: ${data.protocol}. Gunakan: HTTP, HTTPS, TCP, atau ICMP.`
        );
      }
      data.protocol = protocol;
    }

    const currentTarget = await targetsService.findById(targetId, teamId);
    if (!currentTarget) {
      throw new NotFoundError("Target tidak ditemukan");
    }

    const finalProtocol =
      data.protocol !== undefined ? data.protocol : currentTarget.protocol;

    const updates: Record<string, unknown> = {};

    if (data.name !== undefined) {
      updates.name = data.name;
    }
    if (data.host !== undefined) {
      updates.host = data.host;
    }

    if (finalProtocol === "ICMP") {
      updates.port = null;
    } else if (data.port !== undefined) {
      if (
        finalProtocol === "TCP" &&
        (data.port === null || data.port === "")
      ) {
        throw new BadRequestError("Port wajib diisi untuk protokol TCP.");
      }
      updates.port =
        data.port === null || data.port === "" ? null : Number(data.port);
    }

    if (data.protocol !== undefined) {
      updates.protocol = data.protocol;
    }
    if (data.interval_seconds !== undefined) {
      updates.intervalSeconds = Math.max(5, data.interval_seconds);
    }

    await targetsService.update(targetId, teamId, updates);
    return { message: "Updated" };
  },

  async deleteTarget(targetId: string, teamId: string) {
    const target = await targetsService.findById(targetId, teamId);
    if (!target) {
      throw new NotFoundError("Target tidak ditemukan atau akses ditolak");
    }
    await targetsService.delete(targetId, teamId);
    return { message: "Deleted" };
  },

  async getTargetHistory(targetId: string, teamId: string) {
    const history = await targetsService.getPingHistory(targetId, teamId);
    return { history };
  },

  async getTargetIncidents(targetId: string, teamId: string) {
    const incidents = await targetsService.getIncidentLogsByTarget(targetId, teamId);
    return { incidents };
  },
};
