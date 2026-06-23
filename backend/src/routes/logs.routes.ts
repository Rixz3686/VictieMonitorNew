import { Elysia } from "elysia";
import { logsController } from "../controllers/logs.controller";
import { checkTeamAccess } from "../middleware/auth.middleware";
import { setup } from "../setup";

export const logsRoutes = new Elysia()
  .use(setup)
  .get(
    "/api/teams/:teamId/logs",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        return { error: "Forbidden" };
      const result = await logsController.getLogs(params.teamId);
      return result;
    }
  )
  .delete(
    "/api/teams/:teamId/logs",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        return { error: "Forbidden" };
      const result = await logsController.clearLogs(params.teamId);
      return result;
    }
  );
