import { useMemo } from "react";
import type { Target } from "../types";

export const useTargetStats = (targets: Target[]) => {
  return useMemo(() => {
    let upCount = 0;
    let downCount = 0;
    let latencySum = 0;
    let latencyCount = 0;

    for (const t of targets) {
      if (t.current_status === "UP") upCount++;
      else if (t.current_status === "DOWN") downCount++;

      if (t.latency_ms != null) {
        latencySum += t.latency_ms;
        latencyCount++;
      }
    }

    return {
      total: targets.length,
      upCount,
      downCount,
      avgLatency: latencyCount > 0 ? Math.round(latencySum / latencyCount) : 0,
    };
  }, [targets]);
};

