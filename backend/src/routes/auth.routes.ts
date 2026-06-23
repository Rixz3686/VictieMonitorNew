import { Elysia, t } from "elysia";
import { authController } from "../controllers/auth.controller";
import type { JwtPayload } from "../types";
import { setup } from "../setup";

export const authRoutes = new Elysia()
  .use(setup)
  .post(
    "/api/auth/register",
    async ({ body, set }) => {
      try {
        const result = await authController.register(
          body.email,
          body.password
        );
        set.status = 201;
        return result;
      } catch (e) {
        set.status = 400;
        return { error: "Email sudah terdaftar." };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/api/auth/login",
    async ({ body, jwt, cookie: { auth_token }, set }) => {
      try {
        const result = await authController.login(
          body.email,
          body.password,
          jwt
        );
        auth_token?.set({
          value: result.token,
          httpOnly: true,
          path: "/",
          maxAge: 2592000, // 30 days
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        set.status = 200;
        return { message: result.message, userId: result.userId };
      } catch (e) {
        set.status = 401;
        return { error: "Invalid credentials" };
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .post(
    "/api/auth/refresh",
    async ({ jwt, cookie: { auth_token }, set }) => {
      try {
        if (!auth_token) {
          set.status = 401;
          return { error: "No token provided" };
        }
        const token = auth_token.value as string;
        const payload = await jwt.verify(token);
        if (!payload) {
          set.status = 401;
          return { error: "Invalid token" };
        }
        const verified = payload as unknown as JwtPayload;
        const result = await authController.refresh(
          verified.id,
          verified.email,
          jwt
        );
        auth_token?.set({
          value: result.token,
          httpOnly: true,
          path: "/",
          maxAge: 2592000, // 30 days
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        set.status = 200;
        return { message: "Token refreshed" };
      } catch (e) {
        set.status = 401;
        return { error: "Token refresh failed" };
      }
    }
  );
