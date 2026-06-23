import type { Target } from "../../../types";
import { TCP_TIMEOUT_MS } from "../../../config/constants";

export async function checkTCP(
  target: Target,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  const port = Number(target.port);
  if (!port || isNaN(port) || port < 1 || port > 65535) {
    return { 
      status: "DOWN", 
      latency: 0,
      errorReason: "Invalid Port",
      errorDetails: `The port value "${target.port}" is not a valid TCP port. Port must be between 1 and 65535.`
    };
  }

  const start = performance.now();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let sock: { end: () => void } | null = null;

  try {
    const result = await new Promise<{
      status: "UP" | "DOWN";
      latency: number;
    }>((resolve, reject) => {
      let done = false;

      timeoutId = setTimeout(() => {
        if (done) return;
        done = true;
        try {
          sock?.end();
        } catch {}
        reject(new Error(`TCP timeout (${TCP_TIMEOUT_MS}ms)`));
      }, TCP_TIMEOUT_MS);

      Bun.connect({
        hostname: target.host,
        port: port,
        socket: {
          open(s) {
            if (done) {
              try { s.end(); } catch {}
              return;
            }
            done = true;
            sock = s;
            const latency = Math.round(performance.now() - start);
            try { s.end(); } catch {}
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ status: "UP", latency });
          },
          data() {},
          close() {},
          connectError(_s, err) {
            if (done) return;
            done = true;
            if (timeoutId) clearTimeout(timeoutId);
            reject(err);
          },
          error(_s, err) {
            if (done) return;
            done = true;
            try { sock?.end(); } catch {}
            if (timeoutId) clearTimeout(timeoutId);
            reject(err);
          },
        },
      }).catch((err) => {
        if (!done) {
          done = true;
          if (timeoutId) clearTimeout(timeoutId);
          reject(err);
        }
      });
    });

    return result;
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    const msg = String(err?.message || err || "").toLowerCase();

    if (msg.includes("timeout")) {
      return {
        status: "DOWN",
        latency,
        errorReason: "Connection Timeout",
        errorDetails: `The connection attempt to ${target.host}:${port} timed out after ${TCP_TIMEOUT_MS}ms.`
      };
    }
    if (msg.includes("refused") || msg.includes("econnrefused")) {
      return {
        status: "DOWN",
        latency,
        errorReason: "Connection Refused",
        errorDetails: `The host actively refused the TCP connection on port ${port}. Verify the service is running and configured correctly.`
      };
    }
    return {
      status: "DOWN",
      latency,
      errorReason: "Port Unreachable",
      errorDetails: `Could not establish TCP connection to port ${port}: ${err?.message || "Unknown error"}.`
    };
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
