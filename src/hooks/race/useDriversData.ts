
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
        .order('team_id')
        .order('name');

      if (error) throw error;
      
      // Manually adjust team assignments for Tsunoda and Lawson
      const modifiedData = data.map((driver: any) => {
        if (driver.name === "Yuki Tsunoda" && driver.team) {
          // Move Tsunoda to Red Bull
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "Red Bull Racing",
              engine: "Honda RBPT"
            },
            team_name: "Red Bull Racing"
          };
        } else if (driver.name === "Liam Lawson" && driver.team) {
          // Move Lawson to RB (formerly AlphaTauri)
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "RB",
              engine: "Honda RBPT"
            },
            team_name: "RB"
          };
        }
        return driver;
      });
      
      // Sort drivers by team name first, then by surname
      modifiedData.sort((a: any, b: any) => {
        // First, sort by team name
        if (a.team.name !== b.team.name) {
          return a.team.name.localeCompare(b.team.name);
        }
        
        // If same team, sort by surname
        const aSurname = a.name.split(' ').slice(1).join(' ');
        const bSurname = b.name.split(' ').slice(1).join(' ');
        
        return aSurname.localeCompare(bSurname);
      });
      
      return modifiedData;
    },
  });

  return { drivers, isLoadingDrivers };
};
