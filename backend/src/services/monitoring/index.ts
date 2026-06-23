import type { Target } from "../../types";
import { checkHTTP } from "./checkers/http.checker";
import { checkTCP } from "./checkers/tcp.checker";
import { checkICMP } from "./checkers/icmp.checker";

export async function runCheck(
  target: Target,
): Promise<{ status: "UP" | "DOWN"; latency: number; errorReason?: string; errorDetails?: string }> {
  switch (target.protocol) {
    case "HTTP":
    case "HTTPS":
      return checkHTTP(target);
    case "TCP":
      return checkTCP(target);
    case "ICMP":
      return checkICMP(target);
    default:
      console.warn(`[Worker] Protokol tidak dikenal: "${target.protocol}", treating as DOWN`);
      return { status: "DOWN", latency: 0 };
  }
}

export * from "./checkers/http.checker";
export * from "./checkers/tcp.checker";
export * from "./checkers/icmp.checker";
