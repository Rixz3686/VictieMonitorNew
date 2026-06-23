import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { targetsApi } from "../services/api";
import type { Target, TargetPayload } from "../types";

export const useTargets = (teamId: string) => {
  const queryClient = useQueryClient();

  const { data: targets, refetch } = useQuery<Target[]>({
    queryKey: ["targets", teamId],
    queryFn: async ({ signal }) => {
      if (!teamId) return [];
      return targetsApi.getAll(teamId, signal);
    },
    refetchInterval: 5000,
    enabled: !!teamId,
  });

  const createMutation = useMutation({
    mutationFn: (payload: TargetPayload) => targetsApi.create(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targets", teamId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ targetId, payload }: { targetId: string; payload: TargetPayload }) =>
      targetsApi.update(teamId, targetId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targets", teamId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (targetId: string) => targetsApi.delete(teamId, targetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["targets", teamId] });
    },
  });

  return {
    targets: targets ?? [],
    refetch,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
