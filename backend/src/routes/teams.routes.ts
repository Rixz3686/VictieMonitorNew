import { Elysia, t } from "elysia";
import { teamsController } from "../controllers/teams.controller";
import { checkTeamAccess, verifyAuth } from "../middleware/auth.middleware";
import { setup } from "../setup";
import { UnauthorizedError } from "../utils/errors";

export const teamsRoutes = new Elysia()
  .use(setup)
  .post(
    "/api/teams",
    async ({ body, jwt, cookie: { auth_token }, set }) => {
      const payload = await verifyAuth(jwt, auth_token, set);
      if (!payload) throw new UnauthorizedError();

      const result = await teamsController.createTeam(
        body.name,
        payload.id
      );
      set.status = 201;
      return result;
    },
    {
      body: t.Object({
        name: t.String(),
      }),
    }
  )
  .get("/api/teams", async ({ jwt, cookie: { auth_token }, set }) => {
    const payload = await verifyAuth(jwt, auth_token, set);
    if (!payload) throw new UnauthorizedError();

    const result = await teamsController.getTeams(payload.id);
    return result;
  })
  .delete(
    "/api/teams/:teamId",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      const payload = await verifyAuth(jwt, auth_token, set);
      if (!payload) throw new UnauthorizedError();

      const result = await teamsController.deleteTeam(
        params.teamId,
        payload.id
      );
      return result;
    }
  );
