import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

import { setup } from "./src/setup";
import { authRoutes } from "./src/routes/auth.routes";
import { teamsRoutes } from "./src/routes/teams.routes";
import { targetsRoutes } from "./src/routes/targets.routes";
import { logsRoutes } from "./src/routes/logs.routes";
import { startMonitoringWorker } from "./src/services/monitoring/worker.service";
import { isAppError } from "./src/utils/errors";

// CORS: di production, set CORS_ORIGIN ke domain frontend (contoh: "https://monitoring.yourdomain.com")
// Di development, default dinamis (mengikuti origin request agar credentials: true berfungsi)
const PORT = Number(process.env.PORT) || 3002;

const app = new Elysia()
  .use(
    cors({
      origin: (request) => {
        const origin = request.headers.get("origin");
        if (!origin) return false;

        const allowedOriginEnv = process.env.CORS_ORIGIN;
        if (!allowedOriginEnv) {
          // Jika env CORS_ORIGIN kosong, izinkan origin request secara dinamis (echo origin)
          return true;
        }

        // Split jika ada beberapa origin (koma), hilangkan spasi dan trailing slash
        const allowedOrigins = allowedOriginEnv
          .split(",")
          .map((o) => o.trim().replace(/\/$/, ""));
        
        const requestOriginNormalized = origin.trim().replace(/\/$/, "");

        return allowedOrigins.includes(requestOriginNormalized);
      },
      credentials: true,
    })
  )
  .use(setup)
  .onError(({ code, error, set }) => {
    if (isAppError(error)) {
      set.status = error.statusCode;
      return { error: error.message };
    }
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation failed", details: error.message };
    }
    console.error("Unhandled error:", error);
    set.status = 500;
    return { error: "Internal Server Error" };
  })
  .get("/api/health", () => ({ status: "OK" }))
  .use(authRoutes)
  .use(teamsRoutes)
  .use(targetsRoutes)
  .use(logsRoutes);

app.listen(PORT);

startMonitoringWorker();
console.log(`🦊 Backend API berjalan di http://localhost:${PORT}`);
