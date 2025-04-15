
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useDriverDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: driver, isLoading } = useQuery({
    queryKey: ["driver-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(*)")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      
      // Manually adjust team assignment for Tsunoda and Lawson
      if (data.name === "Yuki Tsunoda") {
        return {
          ...data,
          team: {
            ...data.team,
            name: "Red Bull Racing",
            engine: "Honda RBPT"
          },
          team_name: "Red Bull Racing"
        };
      } else if (data.name === "Liam Lawson") {
        return {
          ...data,
          team: {
            ...data.team,
            name: "RB Visa Cash App",
            engine: "Honda RBPT"
          },
          team_name: "RB Visa Cash App"
        };
      }
      
      return data;
    },
    enabled: !!id,
  });

  return { driver, isLoading, id };
};
