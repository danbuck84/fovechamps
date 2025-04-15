
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useDriversAndTeamsData = () => {
  // Fetch all drivers with their team details
  const { data: drivers, isLoading: loadingDrivers } = useQuery({
    queryKey: ["all-drivers-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(*)")
        .order("name");
        
      if (error) throw error;

      // Manually adjust team assignments for Tsunoda and Lawson
      const modifiedData = data.map(driver => {
        if (driver.name === "Yuki Tsunoda" && driver.team) {
          // Move Tsunoda to Red Bull
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "Red Bull Racing",
              engine: "Honda RBPT"
            }
          };
        } else if (driver.name === "Liam Lawson" && driver.team) {
          // Move Lawson to RB Visa Cash App
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "RB Visa Cash App",
              engine: "Honda RBPT"
            }
          };
        }
        return driver;
      });
      
      return modifiedData;
    },
  });
  
  // Fetch all teams with their drivers
  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ["all-teams-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, drivers(*)")
        .order("name");
        
      if (error) throw error;

      // Modify drivers in each team based on our swap
      const modifiedTeams = data.map(team => {
        // For Red Bull Racing
        if (team.name === "Red Bull Racing") {
          const updatedDrivers = team.drivers 
            ? team.drivers.filter(d => d.name !== "Liam Lawson") 
            : [];
            
          // Add Tsunoda to Red Bull if we have the drivers data
          if (drivers) {
            const tsunoda = drivers.find(d => d.name === "Yuki Tsunoda");
            if (tsunoda) {
              updatedDrivers.push(tsunoda);
            }
          }
          
          return {
            ...team,
            drivers: updatedDrivers
          };
        }
        // For RB (formerly AlphaTauri)
        else if (team.name === "RB") {
          const updatedDrivers = team.drivers 
            ? team.drivers.filter(d => d.name !== "Yuki Tsunoda") 
            : [];
            
          // Add Lawson to RB if we have the drivers data
          if (drivers) {
            const lawson = drivers.find(d => d.name === "Liam Lawson");
            if (lawson) {
              updatedDrivers.push(lawson);
            }
          }
          
          return {
            ...team,
            name: "RB Visa Cash App",
            drivers: updatedDrivers
          };
        }
        return team;
      });
      
      return modifiedTeams;
    },
    enabled: !!drivers,
  });
  
  return {
    drivers,
    teams,
    isLoading: loadingDrivers || loadingTeams
  };
};
