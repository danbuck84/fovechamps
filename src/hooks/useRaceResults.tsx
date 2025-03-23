
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Race } from "@/types/betting";

interface RaceResultsResponse {
  id: string;
  race_id: string;
  created_at: string;
  fastest_lap: string | null;
  dnf_drivers: string[] | null;
  qualifying_results: string[];
  race_results: string[];
  pole_time?: string;
}

export function useRaceResults(raceId: string) {
  return useQuery({
    queryKey: ["race-results", raceId],
    queryFn: async () => {
      console.log("Fetching race results for:", raceId);
      
      // First get race details
      const { data: race, error: raceError } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();
      
      if (raceError) throw raceError;
      
      // Then get results
      const { data: results, error: resultsError } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();
      
      if (resultsError && resultsError.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned
        throw resultsError;
      }
      
      return {
        race: race as Race,
        results: results as RaceResultsResponse | null
      };
    },
    enabled: !!raceId,
  });
}
