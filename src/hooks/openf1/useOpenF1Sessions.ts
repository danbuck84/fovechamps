
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
  const { data, isLoading } = useQuery({
    queryKey: ["openf1-races", currentSeason],
    queryFn: async () => {
      try {
        const sessions = await fetchSessions({ season: currentSeason });
        // Only Race sessions
        return sessions.filter(
          (session: OpenF1Session) => session.session_type === "Race"
        );
      } catch (err) {
        toast.error("Não foi possível carregar as corridas desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    raceSessions: data || [],
    loadingRaces: isLoading,
  };
}
