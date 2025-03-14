
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Driver } from "@/types/betting";

export const useDriversData = () => {
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `)
        .order('name');

      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  return { drivers, isLoadingDrivers };
};
