import type { Target } from "../../../types";
import { ICMP_TIMEOUT_MS } from "../../../config/constants";
import { spawn } from "bun";
import { checkTCP } from "./tcp.checker";

interface PipedSubprocess {
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  exited: Promise<number>;
  exitCode: number | null;
  kill: () => void;
}

export async function checkICMP(
  target: Target,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  const isWindows = process.platform === "win32";
  const timeoutSec = Math.ceil(ICMP_TIMEOUT_MS / 1000);

  const pingArgs = isWindows
    ? ["ping", "-n", "1", "-w", String(ICMP_TIMEOUT_MS), target.host]
    : ["ping", "-c", "1", "-W", String(timeoutSec), target.host];

  const start = performance.now();
  let timerId: Timer | null = null;
  const processHandle: { kill?: () => void } = {};

  try {
    const checkPromise = (async () => {
      const proc = spawn(pingArgs, { stdout: "pipe", stderr: "pipe" }) as unknown as PipedSubprocess;
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
    const isOsError =
      errorMsg.includes("UNSUPPORTED_OS") ||
      error?.code === "UNSUPPORTED_OS" ||
      errorMsg.includes("Operation not permitted") ||
      errorMsg.includes("socket");

    if (isOsError) {
      console.warn(
        `[ICMP] OS tidak mendukung raw socket untuk "${target.host}", fallback ke TCP port 443/80...`,
      );
      
      const fallback443 = await checkTCP({ ...target, protocol: "TCP", port: 443 });
      if (fallback443.status === "UP") return fallback443;

      const fallback80 = await checkTCP({ ...target, protocol: "TCP", port: 80 });
      if (fallback80.status === "UP") return fallback80;
      
      return {
        status: "DOWN",
        latency: Math.round(performance.now() - start),
        errorReason: "Host Unreachable (TCP Fallback)",
        errorDetails: `ICMP raw socket not supported by OS. Fallback TCP checks on ports 443 and 80 also failed.`
      };
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
