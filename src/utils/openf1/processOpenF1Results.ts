
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
  const driverPoints: Record<string, GroupedPoints> = {};
  const teamPoints: Record<string, GroupedPoints> = {};

  drivers.forEach((driver) => {
    driverPoints[driver.driver_id] = {
      id: driver.driver_id,
      name: driver.name,
      team_name: driver.team_name,
      nationality: driver.nationality || "N/A",
      points: {},
      total: 0,
    };
  });

  if (teams) {
    teams.forEach((team) => {
      teamPoints[team.team_id] = {
        id: team.team_id,
        name: team.team_name,
        points: {},
        total: 0,
      };
    });
  }

  for (const session of raceSessions) {
    try {
      const results: OpenF1Result[] = await fetchResults({
        session_key: session.session_key,
        season: currentSeason,
      });

      results.forEach((result) => {
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
          driver.points[session.session_key.toString()] = points;
          driver.total += points;

          const driverObj = drivers.find((d) => d.driver_id === result.driver_id);
          if (driverObj && driverObj.team_id && teamPoints[driverObj.team_id]) {
            const team = teamPoints[driverObj.team_id];
            team.points[session.session_key.toString()] =
              (team.points[session.session_key.toString()] || 0) + points;
            team.total += points;
          }
        }
      });
    } catch {
      // Ignore fetch errors here; main hook handles error notification.
    }
  }

  return {
    driversStandings: Object.values(driverPoints).sort((a, b) => b.total - a.total),
    teamsStandings: Object.values(teamPoints).sort((a, b) => b.total - a.total),
  };
}
