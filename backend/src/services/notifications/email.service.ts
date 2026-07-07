import type { Target } from "../../types";

export async function sendEmailAlert(
  target: Target,
  status: "UP" | "DOWN",
  latency: number,
): Promise<void> {
  // No-op
}
