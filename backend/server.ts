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

// Jika CORS_ORIGIN diset, gunakan list origin spesifik; jika tidak, izinkan semua origin (reflect)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true; // true = reflect request origin (aman dengan credentials)

const app = new Elysia()
  .use(
    cors({
      origin: corsOrigin,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
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
