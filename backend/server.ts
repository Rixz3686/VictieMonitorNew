import { Elysia } from "elysia";

import { setup } from "./src/setup";
import { authRoutes } from "./src/routes/auth.routes";
import { teamsRoutes } from "./src/routes/teams.routes";
import { targetsRoutes } from "./src/routes/targets.routes";
import { logsRoutes } from "./src/routes/logs.routes";
import { startMonitoringWorker } from "./src/services/monitoring/worker.service";
import { isAppError } from "./src/utils/errors";

const PORT = Number(process.env.PORT) || 3002;

// ── Helper: tambahkan CORS headers ke set.headers ─────────────────
const addCorsHeaders = (
  headers: Record<string, string | number | string[] | undefined>,
  origin: string | null,
) => {
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Credentials"] = "true";
    headers["Access-Control-Allow-Methods"] =
      "GET, POST, PUT, DELETE, PATCH, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization, Cookie";
  }
};

const app = new Elysia()
  // ── CORS: handle preflight & inject headers ke SEMUA response ────
  .onRequest(({ request, set }) => {
    const origin = request.headers.get("origin");

    // Tambah CORS headers untuk semua request
    addCorsHeaders(set.headers, origin);

    // Handle OPTIONS preflight — langsung kembalikan 204 dengan headers lengkap
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Authorization, Cookie",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
  })
  .use(setup)
  // ── Error handler: pastikan CORS headers juga ada di error response ──
  .onError(({ code, error, set, request }) => {
    const origin = request.headers.get("origin");
    addCorsHeaders(set.headers, origin);

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
