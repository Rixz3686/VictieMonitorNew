import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { historyApi, incidentsApi } from "../services/api";
import type { HistoryEntry, LatencyDataPoint, UptimeStatus, IncidentEntry } from "../types";

const ONE_HOUR_MS = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_SLOTS = 48;
const SLOT_DURATION_MS = 30 * 60 * 1000;

function parseTimestamp(checked_at: string): number {
  const isoBase = checked_at.includes("T") ? checked_at : checked_at.replace(" ", "T");
  const iso = isoBase.endsWith("Z") ? isoBase : isoBase + "Z";
  return new Date(iso).getTime();
}

export const useTargetHistory = (teamId: string | null, targetId: string) => {
  const [nowTs, setNowTs] = useState(() => Date.now());

  const { data: rawHistory, isLoading } = useQuery<HistoryEntry[]>({
    queryKey: ["detail-history", teamId, targetId],
    queryFn: async ({ signal }) => {
      if (!teamId) return [];
      const data = await historyApi.getByTarget(teamId, targetId, signal);
      setNowTs(Date.now());
      return data;
    },
    refetchInterval: 5000,
    enabled: !!teamId && !!targetId,
  });

  const { data: incidents } = useQuery<IncidentEntry[]>({
    queryKey: ["detail-incidents", teamId, targetId],
    queryFn: async ({ signal }) => {
      if (!teamId) return [];
      return incidentsApi.getByTarget(teamId, targetId, signal);
    },
    refetchInterval: 5000,
    enabled: !!teamId && !!targetId,
  });

  const latencyData = useMemo((): LatencyDataPoint[] => {
    if (!rawHistory) return [];
    const since = nowTs - ONE_HOUR_MS;

    return rawHistory
      .map((h) => ({ h, ts: parseTimestamp(h.checked_at) }))
      .filter(({ ts }) => ts > since)
      .map(({ h, ts }) => {
        const time = new Date(ts)
          .toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit" })
          .replace(".", ":");
        return { time, latency: h.latency_ms ?? 0 };
      });
  }, [rawHistory, nowTs]);

  const uptimeBars = useMemo((): UptimeStatus[] => {
    if (!rawHistory || rawHistory.length === 0) {
      return Array.from({ length: TWENTY_FOUR_HOURS_SLOTS }, () => "NODATA" as const);
    }

    const parsedHistory = rawHistory.map((h) => ({
      ...h,
      ts: parseTimestamp(h.checked_at),
    }));

    const bars: UptimeStatus[] = [];

    for (let i = TWENTY_FOUR_HOURS_SLOTS - 1; i >= 0; i--) {
      const sliceStart = nowTs - (i + 1) * SLOT_DURATION_MS;
      const sliceEnd = nowTs - i * SLOT_DURATION_MS;

      const inSlice = parsedHistory.filter(
        (h) => h.ts > sliceStart && h.ts <= sliceEnd,
      );

      if (inSlice.length === 0) {
        bars.push("NODATA");
      } else {
        const hasDown = inSlice.some((h) => h.status === "DOWN");
        bars.push(hasDown ? "DOWN" : "UP");
      }
    }
    return bars;
  }, [rawHistory, nowTs]);

  const avgLatency = useMemo(() => {
    if (latencyData.length === 0) return null;
    const sum = latencyData.reduce((a, d) => a + d.latency, 0);
    return Math.round(sum / latencyData.length);
  }, [latencyData]);

  const lastIncident = useMemo((): string | null => {
    if (!rawHistory) return null;
    const incidents = rawHistory
      .filter((h) => h.status === "DOWN")
      .sort(
        (a, b) => parseTimestamp(b.checked_at) - parseTimestamp(a.checked_at),
      );
    if (incidents.length === 0) return null;
    return new Date(parseTimestamp(incidents[0].checked_at)).toLocaleString(
      "id-ID", { timeZone: "Asia/Jakarta" }
    ) + " WIB";
  }, [rawHistory]);

  return {
    latencyData,
    uptimeBars,
    avgLatency,
    lastIncident,
    incidents: incidents ?? [],
    isLoading,
  };
};
