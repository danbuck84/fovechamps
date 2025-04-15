
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRacePredictions = (raceId: string | null) => {
  return useQuery({
    queryKey: ["race-predictions", raceId],
    queryFn: async () => {
      if (!raceId) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          user:profiles(username, full_name)
        `)
        .eq("race_id", raceId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!raceId,
  });
};
