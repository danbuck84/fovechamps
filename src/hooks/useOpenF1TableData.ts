
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSessions, fetchResults, fetchDrivers, fetchTeams } from "@/services/openf1-api";
import { toast } from "sonner";

// Types based on OpenF1 API response format
interface OpenF1Driver {
  driver_number: number;
  driver_id: string;
  name: string;
  team_name: string;
  team_id: string;
}

interface OpenF1Result {
  position: number;
  driver_id: string;
  session_key: number;
  points?: number;
}

interface OpenF1Session {
  session_key: number;
  session_name: string;
  session_type: string;
  country_name: string;
  circuit_short_name: string;
  date_start: string;
}

interface GroupedPoints {
  id: string;
  name: string;
  team_name?: string;
  team_id?: string;
  nationality?: string;
  points: Record<string, number>;
  total: number;
}

export const useOpenF1TableData = (currentSeason = 2024) => {
  const [driversStandings, setDriversStandings] = useState<GroupedPoints[]>([]);
  const [teamsStandings, setTeamsStandings] = useState<GroupedPoints[]>([]);

  // Fetch all races for the current season
  const { data: raceSessions, isLoading: loadingRaces } = useQuery({
    queryKey: ["openf1-races", currentSeason],
    queryFn: async () => {
      try {
        const sessions = await fetchSessions({ 
          season: currentSeason,
          // Filter only race sessions, not practice or qualifying
          // session_type: 'Race'
        });
        
        return sessions.filter((session: OpenF1Session) => 
          session.session_type === 'Race'
        );
      } catch (error) {
        console.error("Error fetching race sessions:", error);
        toast.error("Não foi possível carregar as corridas desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all drivers for the current season
  const { data: drivers, isLoading: loadingDrivers } = useQuery({
    queryKey: ["openf1-drivers", currentSeason],
    queryFn: async () => {
      try {
        return await fetchDrivers({ season: currentSeason });
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Não foi possível carregar os pilotos desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch all teams for the current season
  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ["openf1-teams", currentSeason],
    queryFn: async () => {
      try {
        return await fetchTeams({ season: currentSeason });
      } catch (error) {
        console.error("Error fetching teams:", error);
        toast.error("Não foi possível carregar as equipes desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Process race results when races and drivers data is available
  useEffect(() => {
    if (!raceSessions || !drivers) return;

    const processRaceResults = async () => {
      try {
        // Initialize driver standings data structure
        const driverPoints: Record<string, GroupedPoints> = {};
        const teamPoints: Record<string, GroupedPoints> = {};
        
        // Initialize all drivers with zero points
        drivers.forEach((driver: OpenF1Driver) => {
          driverPoints[driver.driver_id] = {
            id: driver.driver_id,
            name: driver.name,
            team_name: driver.team_name,
            nationality: "", // OpenF1 doesn't provide nationality directly
            points: {},
            total: 0
          };
        });

        // Initialize all teams with zero points
        if (teams) {
          teams.forEach((team: any) => {
            teamPoints[team.team_id] = {
              id: team.team_id,
              name: team.team_name,
              points: {},
              total: 0
            };
          });
        }
        
        // Fetch and process results for each race session
        for (const session of raceSessions) {
          const results = await fetchResults({ 
            session_key: session.session_key,
            season: currentSeason 
          });
          
          // Process driver points
          results.forEach((result: OpenF1Result) => {
            const driver = driverPoints[result.driver_id];
            if (driver) {
              // F1 points system: 25-18-15-12-10-8-6-4-2-1 for positions 1-10
              let points = 0;
              
              if (result.points !== undefined) {
                points = result.points;
              } else {
                // Calculate points based on position if not provided by API
                switch (result.position) {
                  case 1: points = 25; break;
                  case 2: points = 18; break;
                  case 3: points = 15; break;
                  case 4: points = 12; break;
                  case 5: points = 10; break;
                  case 6: points = 8; break;
                  case 7: points = 6; break;
                  case 8: points = 4; break;
                  case 9: points = 2; break;
                  case 10: points = 1; break;
                  default: points = 0; break;
                }
              }
              
              driver.points[session.session_key.toString()] = points;
              driver.total += points;
              
              // Add to team points if we have team info
              const driverObj = drivers.find((d: OpenF1Driver) => d.driver_id === result.driver_id);
              if (driverObj && driverObj.team_id && teamPoints[driverObj.team_id]) {
                const team = teamPoints[driverObj.team_id];
                team.points[session.session_key.toString()] = 
                  (team.points[session.session_key.toString()] || 0) + points;
                team.total += points;
              }
            }
          });
        }
        
        // Convert to arrays and sort by total points (descending)
        setDriversStandings(Object.values(driverPoints)
          .sort((a, b) => b.total - a.total));
          
        setTeamsStandings(Object.values(teamPoints)
          .sort((a, b) => b.total - a.total));
          
      } catch (error) {
        console.error("Error processing race results:", error);
        toast.error("Erro ao processar os resultados das corridas");
      }
    };

    processRaceResults();
  }, [raceSessions, drivers, teams, currentSeason]);

  return {
    races: raceSessions,
    driversStandings,
    teamsStandings,
    loading: loadingRaces || loadingDrivers || loadingTeams,
    currentSeason
  };
};
