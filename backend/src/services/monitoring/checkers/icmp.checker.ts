import type { Target } from "../../../types";
import { ICMP_TIMEOUT_MS } from "../../../config/constants";
import { checkTCP } from "./tcp.checker";

const spawn = typeof Bun !== "undefined" ? Bun.spawn : null;

interface PipedSubprocess {
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  exited: Promise<number>;
  exitCode: number | null;
  kill: () => void;
}

/**
 * Cache whether ping is available on this system.
 * null = not yet checked, true = available, false = not available
 */
let pingAvailable: boolean | null = null;

/**
 * Detect if the `ping` command is available on the system.
 * Runs once and caches the result.
 */
async function isPingAvailable(): Promise<boolean> {
  if (pingAvailable !== null) return pingAvailable;

  if (!spawn) {
    pingAvailable = false;
    console.log("[ICMP] Bun.spawn not available (Cloudflare Workers), using TCP fallback.");
    return false;
  }

  const isWindows = process.platform === "win32";
  const cmd = isWindows
    ? `${process.env.SystemRoot || "C:\\Windows"}\\System32\\ping.exe`
    : "ping";

  try {
    // Try to spawn ping with help flag to see if it exists
    const proc = spawn!([cmd, isWindows ? "/?" : "-h"], {
      stdout: "pipe",
      stderr: "pipe",
    }) as unknown as PipedSubprocess;

    // Consume streams to avoid hanging
    await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);

    // If we get here without error, ping exists
    pingAvailable = true;
    console.log("[ICMP] ping command detected, using native ICMP checks.");
  } catch {
    pingAvailable = false;
    console.warn(
      "[ICMP] ping command not found on this system. ICMP checks will use TCP connectivity fallback.",
    );
  }

  return pingAvailable;
}

/**
 * TCP-based "reachability" check used as ICMP fallback.
 * Tries ports 443, then 80 to determine if host is up.
 */
async function tcpFallbackCheck(
  target: Target,
  start: number,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  // Try port 443 (HTTPS) first
  const fallback443 = await checkTCP({ ...target, protocol: "TCP", port: 443 });
  if (fallback443.status === "UP") {
    return {
      status: "UP",
      latency: fallback443.latency,
    };
  }

  // Try port 80 (HTTP) as second fallback
  const fallback80 = await checkTCP({ ...target, protocol: "TCP", port: 80 });
  if (fallback80.status === "UP") {
    return {
      status: "UP",
      latency: fallback80.latency,
    };
  }

  return {
    status: "DOWN",
    latency: Math.round(performance.now() - start),
    errorReason: "Host Unreachable",
    errorDetails: `Host did not respond on TCP ports 443 and 80. The host may be down or blocking connections.`,
  };
}

export async function checkICMP(
  target: Target,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  const start = performance.now();

  // If ping is not available (e.g. Docker/Railway container), use TCP fallback directly
  const hasPing = await isPingAvailable();
  if (!hasPing) {
    return tcpFallbackCheck(target, start);
  }

  // Native ping check
  const isWindows = process.platform === "win32";
  const timeoutSec = Math.ceil(ICMP_TIMEOUT_MS / 1000);

  const pingCmd = isWindows
    ? `${process.env.SystemRoot || "C:\\Windows"}\\System32\\ping.exe`
    : "ping";

  const pingArgs = isWindows
    ? [pingCmd, "-n", "1", "-w", String(ICMP_TIMEOUT_MS), target.host]
    : [pingCmd, "-c", "1", "-W", String(timeoutSec), target.host];

  let timerId: Timer | null = null;
  const processHandle: { kill?: () => void } = {};

  try {
    const checkPromise = (async () => {
      const proc = spawn!(pingArgs, { stdout: "pipe", stderr: "pipe" }) as unknown as PipedSubprocess;
      processHandle.kill = () => proc.kill();
      
      const [output, _errOutput] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
        proc.exited,
      ]);
      
      return { output, exitCode: proc.exitCode };
    })();

    const timeoutPromise = new Promise<{ output: string; exitCode: number | null }>((_, reject) => {
      timerId = setTimeout(() => reject(new Error("ICMP Timeout")), ICMP_TIMEOUT_MS + 1000);
    });

    const { output, exitCode } = await Promise.race([checkPromise, timeoutPromise]);
    
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    if (exitCode !== 0) {
      return { 
        status: "DOWN", 
        latency: Math.round(performance.now() - start),
        errorReason: "Request Timeout / Packet Loss",
        errorDetails: `The host did not respond to ICMP Echo requests (ping timed out or packet was lost).`
      };
    }

    const lessThan = /[Tt]ime<1\s*ms|[Ww]aktu<1\s*m[sd]/i.test(output);
    const matchTime = output.match(/[Tt]ime[=<]([\d.]+)\s*ms/i);
    const matchWaktu = output.match(/[Ww]aktu[=<]([\d.]+)\s*m[sd]/i);

    let latency = Math.round(performance.now() - start);
    if (lessThan) latency = 0;
    else if (matchTime) latency = Math.round(parseFloat(matchTime[1]!));
    else if (matchWaktu) latency = Math.round(parseFloat(matchWaktu[1]!));

    return { status: "UP", latency };
  } catch (err: unknown) {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (processHandle.kill) {
      try {
        processHandle.kill();
      } catch {}
    }

    const error = err as Error & { code?: string };
    const errorMsg = String(error?.message || error || "");

    // If ping suddenly fails (permission issue, etc.), fallback to TCP
    const isOsError =
      errorMsg.includes("UNSUPPORTED_OS") ||
      error?.code === "UNSUPPORTED_OS" ||
      errorMsg.includes("Operation not permitted") ||
      errorMsg.includes("not found in $PATH") ||
      errorMsg.includes("Executable not found") ||
      errorMsg.includes("socket");

    if (isOsError) {
      console.warn(
        `[ICMP] ping failed for "${target.host}" (${errorMsg}), falling back to TCP...`,
      );
      // Mark ping as unavailable so future checks skip directly to TCP
      pingAvailable = false;
      return tcpFallbackCheck(target, start);
    }

    if (errorMsg.includes("ICMP Timeout")) {
      return {
        status: "DOWN",
        latency: Math.round(performance.now() - start),
        errorReason: "Ping Process Timeout",
        errorDetails: `The ICMP echo process timed out without receiving a response.`
      };
    }

    return { 
      status: "DOWN", 
      latency: Math.round(performance.now() - start),
      errorReason: "ICMP Failure",
      errorDetails: `An error occurred during ICMP check: ${error?.message || "Unknown error"}`
    };
  }
}
