import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { logsApi } from "../services/api";
import type { LogEntry } from "../types";

export const useLogs = (teamId: string | null) => {
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery<LogEntry[]>({
    queryKey: ["logs", teamId],
    queryFn: async ({ signal }) => {
      if (!teamId) return [];
      return logsApi.getAll(teamId, signal);
    },
    refetchInterval: 10_000,
    enabled: !!teamId,
  });

  const stats = useMemo(() => {
    const downCount = logs.filter((l) => l.status === "DOWN").length;
    const upCount = logs.filter((l) => l.status === "UP").length;
    return { total: logs.length, downCount, upCount };
  }, [logs]);

  const clearLogs = async (): Promise<void> => {
    if (!teamId) return;
    await logsApi.clearAll(teamId);
    queryClient.setQueryData(["logs", teamId], []);
  };

  return { logs, stats, clearLogs };
};
