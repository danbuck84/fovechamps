
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*");

      if (error) throw error;
      return data || [];
    },
  });
};
