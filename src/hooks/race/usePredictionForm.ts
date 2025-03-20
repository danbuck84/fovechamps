import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Driver } from "@/types/betting";

export const usePredictionForm = (
  raceId: string | undefined,
  isDeadlinePassed: boolean
) => {
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(20).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(20).fill(""));
  const [dnfPredictions, setDnfPredictions] = useState<string[]>([]);
  const [existingPrediction, setExistingPrediction] = useState<any>(null);

  // Fetch existing prediction
  const { data: existingPredictionQuery } = useQuery({
    queryKey: ["prediction", raceId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !raceId) return null;

      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("race_id", raceId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar palpite existente:", error);
        return null;
      }

      return data;
    },
    enabled: !!raceId,
  });

  // Set up form data from existing prediction
  useEffect(() => {
    if (existingPredictionQuery && !isDeadlinePassed) {
      setExistingPrediction(existingPredictionQuery);
      setPoleTime(existingPredictionQuery.pole_time || "");
      setFastestLap(existingPredictionQuery.fastest_lap || "");
      
      // Ensure arrays are of correct length
      const qualResults = existingPredictionQuery.qualifying_results || [];
      const raceResults = existingPredictionQuery.top_10 || [];
      
      // Fill arrays with the existing values, and empty strings for the rest up to 20
      setQualifyingTop10(Array(20).fill("").map((_, i) => qualResults[i] || ""));
      setRaceTop10(Array(20).fill("").map((_, i) => raceResults[i] || ""));
      
      setDnfPredictions(existingPredictionQuery.dnf_predictions || []);
    }
  }, [existingPredictionQuery, isDeadlinePassed]);

  // Helper functions
  const handleDriverDNF = (count: number) => {
    setDnfPredictions(Array(count).fill(""));
  };

  const getAvailableDrivers = (
    drivers: (Driver & { team: { name: string; engine: string } })[] | undefined,
    position: number, 
    isQualifying: boolean = true
  ) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    const currentPositionDriver = selectedDrivers[position];
    
    // Include all drivers that are not selected in any position or are in the current position
    return drivers.filter(driver => {
      // If this is the current position's driver, include it
      if (driver.id === currentPositionDriver) return true;
      
      // Otherwise, include it only if it's not used elsewhere
      // Filter out blank/empty values before checking
      return !selectedDrivers.filter(Boolean).includes(driver.id);
    });
  };

  return {
    poleTime,
    setPoleTime,
    fastestLap,
    setFastestLap,
    qualifyingTop10,
    setQualifyingTop10,
    raceTop10,
    setRaceTop10,
    dnfPredictions,
    handleDriverDNF,
    getAvailableDrivers,
    existingPrediction,
    setExistingPrediction,
    existingPredictionQuery
  };
};
