import { useQuery, useQueryClient } from "@tanstack/react-query";
import { teamsApi } from "../services/api";
import type { Team } from "../types";

export const useTeams = () => {
  const queryClient = useQueryClient();

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["teams"],
    queryFn: async () => teamsApi.getAll(),
    staleTime: 30_000,
  });

  const invalidateTeams = (): void => {
    queryClient.invalidateQueries({ queryKey: ["teams"] });
  };

  const invalidateTargets = (): void => {
    queryClient.invalidateQueries({ queryKey: ["targets"] });
  };

  return { teams, invalidateTeams, invalidateTargets };
};
