import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "cloudflare:workers";

const workerEnv = env as any;

if (workerEnv.NODE_ENV === "production" && !workerEnv.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing in production!");
}

export const setup = new Elysia({ name: "setup" }).use(
  jwt({
    name: "jwt",
    secret: workerEnv.JWT_SECRET || "RAHASIA_SUPER_AMAN_DEV_ONLY",
  })
);
