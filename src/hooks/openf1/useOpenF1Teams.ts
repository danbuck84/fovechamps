
import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/services/openf1-api";
import { toast } from "sonner";

export interface OpenF1Team {
  team_id: string;
  team_name: string;
}

export function useOpenF1Teams(currentSeason: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["openf1-teams", currentSeason],
    queryFn: async () => {
      try {
        console.log(`Fetching teams for season ${currentSeason}`);
        // For 2025, use 2024 data as fallback since it's a future season
        const actualSeason = currentSeason === 2025 ? 2024 : currentSeason;
        
        const response = await fetchTeams({ season: actualSeason });
        
        if (!response || !Array.isArray(response)) {
          console.error("Invalid teams response:", response);
          return [];
        }
        
        console.log(`Found ${response.length} teams for season ${currentSeason} (using ${actualSeason} data)`);
        return response;
      } catch (err) {
        console.error(`Error fetching teams for season ${currentSeason}:`, err);
        toast.error("Não foi possível carregar as equipes desta temporada");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  });

  return {
    teams: data || [],
    loadingTeams: isLoading,
    teamError: error,
  };
}
