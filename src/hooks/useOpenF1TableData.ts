
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

  const { raceSessions, loadingRaces } = useOpenF1Sessions(currentSeason);
  const { drivers, loadingDrivers } = useOpenF1Drivers(currentSeason);
  const { teams, loadingTeams } = useOpenF1Teams(currentSeason);

  useEffect(() => {
    let cancelled = false;

    const updateResults = async () => {
      if (!raceSessions || !drivers || !teams) return;

      try {
        const { driversStandings, teamsStandings } =
          await processOpenF1Results(raceSessions, drivers, teams, currentSeason);

        if (!cancelled) {
          setDriversStandings(driversStandings);
          setTeamsStandings(teamsStandings);
        }
      } catch (e) {
        toast.error("Erro ao processar os resultados das corridas");
      }
    };

    updateResults();
    return () => {
      cancelled = true;
    };
  }, [raceSessions, drivers, teams, currentSeason]);

  return {
    races: raceSessions,
    driversStandings,
    teamsStandings,
    loading: loadingRaces || loadingDrivers || loadingTeams,
    currentSeason,
  };
};
