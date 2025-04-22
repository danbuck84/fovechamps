
import { useQuery } from "@tanstack/react-query";
import { fetchSessions } from "@/services/openf1-api";
import { toast } from "sonner";

export interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  country_name: string;
  circuit_short_name: string;
  date_start: string;
  round?: number;
}

export function useOpenF1Sessions(currentSeason: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["openf1-races", currentSeason],
    queryFn: async () => {
      try {
        console.log(`Fetching sessions for season ${currentSeason}`);
        // For 2025, use 2024 data as fallback since it's a future season
        const actualSeason = currentSeason === 2025 ? 2024 : currentSeason;
        
        const sessions = await fetchSessions({ season: actualSeason });
        
        if (!sessions || !Array.isArray(sessions)) {
          console.error("Invalid sessions response:", sessions);
          return [];
        }
        
        // Only Race sessions
        const racesSessions = sessions.filter(
          (session: OpenF1Session) => session.session_type === "Race"
        );
        
        console.log(`Found ${racesSessions.length} race sessions for season ${currentSeason} (using ${actualSeason} data)`);
        return racesSessions;
      } catch (err) {
        console.error(`Error fetching sessions for season ${currentSeason}:`, err);
        toast.error("Não foi possível carregar as corridas desta temporada");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  });

  return {
    raceSessions: data || [],
    loadingRaces: isLoading,
    raceError: error,
  };
}
