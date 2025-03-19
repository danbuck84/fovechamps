
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useRaceManagementQuery = () => {
  const { data: races, isLoading, refetch } = useQuery({
    queryKey: ["admin-races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return { races, isLoading, refetch };
};
