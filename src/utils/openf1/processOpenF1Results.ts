
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
  // Set default result in case of errors
  const defaultResult = { driversStandings: [], teamsStandings: [] };
  
  // Validate input arguments
  if (!raceSessions || !Array.isArray(raceSessions) || raceSessions.length === 0) {
    console.error("Invalid or empty race sessions:", raceSessions);
    return defaultResult;
  }
  
  if (!drivers || !Array.isArray(drivers) || drivers.length === 0) {
    console.error("Invalid or empty drivers:", drivers);
    return defaultResult;
  }
  
  if (!teams || !Array.isArray(teams) || teams.length === 0) {
    console.error("Invalid or empty teams:", teams);
    return defaultResult;
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
        total: 0,  // Corrigido o valor de R0 para 0
      };
    }
  });

  // Initialize team standings
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

  // Limit to 15 sessions for performance
  const limitedSessions = raceSessions.slice(0, 15);
  
  // Process race results
  const processedSessions = [];
  let hasError = false;
  
  for (const session of limitedSessions) {
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

      if (!results || !Array.isArray(results) || results.length === 0) {
        console.warn(`No results for session ${session.session_key}`);
        continue;
      }

      processedSessions.push(session.session_key);
      
      results.forEach((result) => {
        if (!result || !result.driver_id) return;
        
        // Find the driver in our initialized data
        const driver = driverPoints[result.driver_id];
        if (!driver) {
          console.log(`Driver not found: ${result.driver_id}`);
          return;
        }
        
        let points = 0;
        if (result.points !== undefined) {
          points = result.points;
        } else {
          // Default F1 points system
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
      });
    } catch (error) {
      console.error(`Error processing session ${session.session_key}:`, error);
      hasError = true;
      // Continue to next session instead of failing entirely
    }
  }
  
  console.log(`Processed ${processedSessions.length} sessions, with errors: ${hasError}`);
  
  // Return empty arrays if we couldn't process any sessions
  if (processedSessions.length === 0 && hasError) {
    console.warn("Could not process any sessions, returning empty results");
    return defaultResult;
  }

  return {
    driversStandings: Object.values(driverPoints).sort((a, b) => b.total - a.total),
    teamsStandings: Object.values(teamPoints).sort((a, b) => b.total - a.total),
  };
}
