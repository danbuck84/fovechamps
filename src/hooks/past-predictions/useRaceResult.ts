
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRaceResult = (raceId: string | null) => {
  return useQuery({
    queryKey: ["race-result", raceId],
    queryFn: async () => {
      if (!raceId) return null;

      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!raceId,
  });
};
