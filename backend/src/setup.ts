import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import process from "node:process";

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is missing in production!");
}

export const setup = new Elysia({ name: "setup" }).use(
  jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET || "RAHASIA_SUPER_AMAN_DEV_ONLY",
  })
);
