
import { useState, useEffect, useRef } from "react";
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
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use a ref to track if the effect is currently running to prevent potential loops
  const processingRef = useRef(false);

  const { raceSessions, loadingRaces, raceError } = useOpenF1Sessions(currentSeason);
  const { drivers, loadingDrivers, driverError } = useOpenF1Drivers(currentSeason);
  const { teams, loadingTeams, teamError } = useOpenF1Teams(currentSeason);

  // Combine all potential errors
  useEffect(() => {
    const combinedError = raceError || driverError || teamError;
    if (combinedError) {
      console.error("API error detected:", combinedError);
      setError(combinedError instanceof Error ? combinedError : new Error("Erro na API"));
      toast.error("Erro ao carregar dados da API");
    }
  }, [raceError, driverError, teamError]);

  useEffect(() => {
    let isMounted = true;
    
    // Skip if already processing to prevent loops
    if (processingRef.current || isProcessing) {
      console.log("Skipping duplicate processing");
      return;
    }

    const updateResults = async () => {
      // Set processing flags to prevent concurrent processing
      processingRef.current = true;
      setIsProcessing(true);
      
      // Reset error state at the start
      setError(null);
      
      try {
        // Add safe checks for all data
        if (!raceSessions || raceSessions.length === 0) {
          console.log("No race sessions available, skipping results processing");
          return;
        }
        
        if (!drivers || drivers.length === 0) {
          console.log("No drivers available, skipping results processing");
          return;
        }
        
        if (!teams || teams.length === 0) {
          console.log("No teams available, skipping results processing");
          return;
        }

        console.log("Processing F1 results for season:", currentSeason, {
          races: raceSessions.length,
          drivers: drivers.length,
          teams: teams.length
        });
        
        const results = await processOpenF1Results(raceSessions, drivers, teams, currentSeason);
        
        if (!isMounted) return;
        
        console.log("Setting standings data", {
          driversCount: results.driversStandings?.length || 0,
          teamsCount: results.teamsStandings?.length || 0
        });
        
        // Make sure we always set arrays, even if empty
        setDriversStandings(results.driversStandings || []);
        setTeamsStandings(results.teamsStandings || []);
      } catch (e) {
        console.error("Error processing results:", e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error("Erro ao processar resultados"));
          toast.error("Erro ao processar os resultados das corridas");
        }
      } finally {
        // Clear processing flags when done
        if (isMounted) {
          setIsProcessing(false);
        }
        processingRef.current = false;
      }
    };

    // Only process if all data is loaded and we're not already processing
    if (!loadingRaces && !loadingDrivers && !loadingTeams && 
        raceSessions && drivers && teams) {
      updateResults();
    }

    return () => {
      isMounted = false;
    };
  }, [raceSessions, drivers, teams, currentSeason, loadingRaces, loadingDrivers, loadingTeams]);

  return {
    races: raceSessions || [],
    driversStandings,
    teamsStandings,
    loading: loadingRaces || loadingDrivers || loadingTeams || isProcessing,
    error,
    currentSeason,
  };
};
