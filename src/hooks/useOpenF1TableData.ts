
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOpenF1Sessions } from "./openf1/useOpenF1Sessions";
import { useOpenF1Drivers } from "./openf1/useOpenF1Drivers";
import { useOpenF1Teams } from "./openf1/useOpenF1Teams";
import { processOpenF1Results } from "@/utils/openf1/processOpenF1Results";
import type { GroupedPoints } from "@/utils/openf1/processOpenF1Results";

export const useOpenF1TableData = (currentSeason = 2025) => {
  const [driversStandings, setDriversStandings] = useState<GroupedPoints[]>([]);
  const [teamsStandings, setTeamsStandings] = useState<GroupedPoints[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const { raceSessions, loadingRaces } = useOpenF1Sessions(currentSeason);
  const { drivers, loadingDrivers } = useOpenF1Drivers(currentSeason);
  const { teams, loadingTeams } = useOpenF1Teams(currentSeason);

  useEffect(() => {
    let cancelled = false;

    const updateResults = async () => {
      // Reset error state
      setError(null);
      
      // Check if data is available
      if (!raceSessions || !drivers || !teams) {
        console.log("Missing data, skipping results processing", {
          raceSessions: !!raceSessions,
          drivers: !!drivers,
          teams: !!teams
        });
        return;
      }

      try {
        console.log("Processing F1 results for season:", currentSeason);
        
        const { driversStandings, teamsStandings } =
          await processOpenF1Results(raceSessions, drivers, teams, currentSeason);

        if (!cancelled) {
          console.log("Setting standings data", {
            driversCount: driversStandings?.length || 0,
            teamsCount: teamsStandings?.length || 0
          });
          
          // Make sure we always set arrays, even if empty
          setDriversStandings(driversStandings || []);
          setTeamsStandings(teamsStandings || []);
        }
      } catch (e) {
        console.error("Error processing results:", e);
        setError(e instanceof Error ? e : new Error("Erro desconhecido"));
        toast.error("Erro ao processar os resultados das corridas");
      }
    };

    updateResults();
    return () => {
      cancelled = true;
    };
  }, [raceSessions, drivers, teams, currentSeason]);

  return {
    races: raceSessions || [],
    driversStandings,
    teamsStandings,
    loading: loadingRaces || loadingDrivers || loadingTeams,
    error,
    currentSeason,
  };
};
