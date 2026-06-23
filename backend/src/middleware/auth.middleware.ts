import type { JwtToken, JwtPayload, ElysiaSet } from "../types";

export const checkTeamAccess = async (
  teamId: string,
  jwt: JwtToken,
  auth_token: { value?: string | unknown } | undefined,
  set: ElysiaSet,
): Promise<boolean> => {
  const payload = await jwt.verify((auth_token?.value as string) || "");
  if (!payload) {
    set.status = 401;
    return false;
  }
  
  const { teamsService } = await import("../services/database/teams.service");
  const isMember = teamsService.isMember(teamId, (payload as JwtPayload).id);
  
  if (!isMember) {
    set.status = 403;
    return false;
  }
  return true;
};

export const verifyAuth = async (
  jwt: JwtToken,
  auth_token: { value?: string | unknown } | undefined,
  set: ElysiaSet
): Promise<JwtPayload | null> => {
  const payload = await jwt.verify((auth_token?.value as string) || "");
  if (!payload) {
    set.status = 401;
    return null;
  }
  return payload as JwtPayload;
};
