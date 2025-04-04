
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: team, isLoading } = useQuery({
    queryKey: ["team-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("teams")
        .select("*, drivers(*)")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      
      // Handle the special case for Red Bull and RB
      if (data.name === "Red Bull Racing") {
        // Add Tsunoda to Red Bull
        const tsunodaQuery = await supabase
          .from("drivers")
          .select("*")
          .ilike("name", "%Tsunoda%")
          .single();
          
        if (!tsunodaQuery.error && tsunodaQuery.data) {
          // Create a new array with all drivers except Lawson, then add Tsunoda
          const updatedDrivers = data.drivers
            .filter(d => d.name !== "Liam Lawson")
            .concat([tsunodaQuery.data]);
          
          return {
            ...data,
            drivers: updatedDrivers
          };
        }
      } else if (data.name === "RB") {
        // Add Lawson to RB
        const lawsonQuery = await supabase
          .from("drivers")
          .select("*")
          .ilike("name", "%Lawson%")
          .single();
          
        if (!lawsonQuery.error && lawsonQuery.data) {
          // Create a new array with all drivers except Tsunoda, then add Lawson
          const updatedDrivers = data.drivers
            .filter(d => d.name !== "Yuki Tsunoda")
            .concat([lawsonQuery.data]);
          
          return {
            ...data,
            drivers: updatedDrivers
          };
        }
      }
      
      return data;
    },
    enabled: !!id,
  });
  
  return { team, isLoading, id };
};
