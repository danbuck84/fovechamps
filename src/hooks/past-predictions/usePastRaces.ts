
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const usePastRaces = () => {
  return useQuery({
    queryKey: ["past-races"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .lt("qualifying_date", now.toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
};
