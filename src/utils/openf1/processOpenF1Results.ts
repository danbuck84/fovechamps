
import { fetchResults } from "@/services/openf1-api";
import type { OpenF1Session } from "@/hooks/openf1/useOpenF1Sessions";
import type { OpenF1Driver } from "@/hooks/openf1/useOpenF1Drivers";
import type { OpenF1Team } from "@/hooks/openf1/useOpenF1Teams";

export interface GroupedPoints {
  id: string;
  name: string;
  team_name?: string;
  team_id?: string;
  nationality?: string;
  points: Record<string, number>;
  total: number;
}

interface OpenF1Result {
  position: number;
  driver_id: string;
  session_key: number;
  points?: number;
}

/**
 * Given sessions, drivers, and teams, populate GroupedPoints for standings.
 */
export async function processOpenF1Results(
  raceSessions: OpenF1Session[],
  drivers: OpenF1Driver[],
  teams: OpenF1Team[],
  currentSeason: number
): Promise<{ driversStandings: GroupedPoints[]; teamsStandings: GroupedPoints[] }> {
  // Validate input arguments
  if (!raceSessions || !Array.isArray(raceSessions)) {
    console.error("Invalid race sessions:", raceSessions);
    return { driversStandings: [], teamsStandings: [] };
  }
  
  if (!drivers || !Array.isArray(drivers)) {
    console.error("Invalid drivers:", drivers);
    return { driversStandings: [], teamsStandings: [] };
  }
  
  if (!teams || !Array.isArray(teams)) {
    console.error("Invalid teams:", teams);
    return { driversStandings: [], teamsStandings: [] };
  }

  const driverPoints: Record<string, GroupedPoints> = {};
  const teamPoints: Record<string, GroupedPoints> = {};

  // Initialize driver standings
  drivers.forEach((driver) => {
    if (driver && driver.driver_id) {
      driverPoints[driver.driver_id] = {
        id: driver.driver_id,
        name: driver.name || "Desconhecido",
        team_name: driver.team_name || "Desconhecido",
        nationality: driver.nationality || "N/A",
        points: {},
        total: 0,
      };
    }
  });

  // Initialize team standings
  if (teams) {
    teams.forEach((team) => {
      if (team && team.team_id) {
        teamPoints[team.team_id] = {
          id: team.team_id,
          name: team.team_name || "Desconhecido",
          points: {},
          total: 0,
        };
      }
    });
  }

  // Process race results
  for (const session of raceSessions) {
    try {
      if (!session || !session.session_key) {
        console.warn("Invalid session data, skipping", session);
        continue;
      }
      
      console.log(`Fetching results for session ${session.session_key} (${session.session_name || 'Unnamed'})`);
      
      const results: OpenF1Result[] = await fetchResults({
        session_key: session.session_key,
        season: currentSeason,
      });

      if (!results || !Array.isArray(results)) {
        console.warn(`No results for session ${session.session_key}`);
        continue;
      }

      results.forEach((result) => {
        if (!result || !result.driver_id) return;
        
        const driver = driverPoints[result.driver_id];
        if (driver) {
          let points = 0;
          if (result.points !== undefined) {
            points = result.points;
          } else {
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
          
          const sessionKey = session.session_key.toString();
          driver.points[sessionKey] = points;
          driver.total += points;

          // Update team points
          const driverObj = drivers.find((d) => d.driver_id === result.driver_id);
          if (driverObj && driverObj.team_id && teamPoints[driverObj.team_id]) {
            const team = teamPoints[driverObj.team_id];
            team.points[sessionKey] = (team.points[sessionKey] || 0) + points;
            team.total += points;
          }
        }
      });
    } catch (error) {
      console.error(`Error processing session ${session.session_key}:`, error);
      // Continue processing other sessions
    }
  }

  return {
    driversStandings: Object.values(driverPoints).sort((a, b) => b.total - a.total),
    teamsStandings: Object.values(teamPoints).sort((a, b) => b.total - a.total),
  };
}
