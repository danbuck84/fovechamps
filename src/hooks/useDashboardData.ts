
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Race, Prediction } from "@/types/betting";

export const useDashboardData = () => {
  const { data: nextRaces, isLoading: isLoadingNextRaces } = useQuery({
    queryKey: ["next-races"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .gt("date", now.toISOString())
        .order("date", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Race[];
    },
  });

  const { data: recentPredictions, isLoading: isLoadingPredictions } = useQuery({
    queryKey: ["recent-predictions"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          race:races (
            name,
            date,
            qualifying_date
          )
        `)
        .eq("user_id", user.data.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as (Prediction & { 
        race: Pick<Race, "name" | "date" | "qualifying_date"> 
      })[];
    },
  });

  const { data: pastRaces, isLoading: isLoadingPastRaces } = useQuery({
    queryKey: ["past-races-dashboard"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .lt("date", now.toISOString())
        .order("date", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Race[];
    },
  });

  const { data: raceResults } = useQuery({
    queryKey: ["race-results-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("race_results")
        .select("race_id")
        .limit(20);

      if (error) throw error;
      return data.map(result => result.race_id);
    },
  });

  // Function to check if a race has results
  const hasResults = (raceId: string) => {
    return raceResults?.includes(raceId) || false;
  };

  return {
    nextRaces,
    recentPredictions,
    pastRaces,
    raceResults,
    hasResults,
    isLoading: isLoadingNextRaces || isLoadingPredictions || isLoadingPastRaces
  };
};
