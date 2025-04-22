
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/services/openf1-api";
import { toast } from "sonner";

export interface OpenF1Team {
  team_id: string;
  team_name: string;
}

export function useOpenF1Teams(currentSeason: number) {
  const { data, isLoading } = useQuery({
    queryKey: ["openf1-teams", currentSeason],
    queryFn: async () => {
      try {
        return await fetchTeams({ season: currentSeason });
      } catch {
        toast.error("Não foi possível carregar as equipes desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    teams: data || [],
    loadingTeams: isLoading,
  };
}
