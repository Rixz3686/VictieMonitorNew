import { Elysia, t } from "elysia";
import { targetsController } from "../controllers/targets.controller";
import { checkTeamAccess } from "../middleware/auth.middleware";
import { setup } from "../setup";
import { ForbiddenError } from "../utils/errors";

export const targetsRoutes = new Elysia()
  .use(setup)
  .get(
    "/api/teams/:teamId/targets",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
      const result = await targetsController.getTargets(params.teamId);
      return result;
    }
  )
  .post(
    "/api/teams/:teamId/targets",
    async ({ params, body, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
        
      const result = await targetsController.createTarget(
        params.teamId,
        body as Parameters<typeof targetsController.createTarget>[1]
      );
      set.status = 201;
      return result;
    },
    {
      body: t.Object({
        name: t.String(),
        host: t.String(),
        port: t.Optional(t.Union([
          t.Numeric({ min: 1, max: 65535 }),
          t.Null(),
          t.String()
        ])),
        protocol: t.String(),
        interval_seconds: t.Optional(t.Number()),
      }),
    }
  )
  .put(
    "/api/teams/:teamId/targets/:targetId",
    async ({ params, body, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
        
      const result = await targetsController.updateTarget(
        params.targetId,
        params.teamId,
        body as Parameters<typeof targetsController.updateTarget>[2]
      );
      return result;
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        host: t.Optional(t.String()),
        port: t.Optional(t.Union([
          t.Numeric({ min: 1, max: 65535 }),
          t.Null(),
          t.String()
        ])),
        protocol: t.Optional(t.String()),
        interval_seconds: t.Optional(t.Number()),
      }),
    }
  )
  .delete(
    "/api/teams/:teamId/targets/:targetId",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
        
      const result = await targetsController.deleteTarget(
        params.targetId,
        params.teamId
      );
      return result;
    }
  )
  .get(
    "/api/teams/:teamId/targets/:targetId/history",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
      const result = await targetsController.getTargetHistory(
        params.targetId,
        params.teamId
      );
      return result;
    }
  )
  .get(
    "/api/teams/:teamId/targets/:targetId/incidents",
    async ({ params, jwt, cookie: { auth_token }, set }) => {
      if (!(await checkTeamAccess(params.teamId, jwt, auth_token, set)))
        throw new ForbiddenError();
      const result = await targetsController.getTargetIncidents(
        params.targetId,
        params.teamId
      );
      return result;
    }
  );
