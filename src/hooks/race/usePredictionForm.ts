
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
      setQualifyingTop10(existingPredictionQuery.qualifying_results || Array(20).fill(""));
      setRaceTop10(existingPredictionQuery.top_10 || Array(20).fill(""));
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
    
    return drivers.filter(driver => {
      return !selectedDrivers.includes(driver.id) || selectedDrivers.indexOf(driver.id) === position;
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
