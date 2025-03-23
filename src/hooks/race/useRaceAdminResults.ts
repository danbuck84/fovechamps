
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRaceResults } from "@/hooks/useRaceResults";
import { useDriverPositions } from "@/hooks/race/useDriverPositions";
import { useDNFDrivers } from "@/hooks/race/useDNFDrivers";
import { useRaceResultsSave } from "@/hooks/race/useRaceResultsSave";
import { useFormatters } from "@/hooks/race/useFormatters";
import type { RaceResult } from "@/types/betting";

export const useRaceAdminResults = () => {
  const navigate = useNavigate();
  const { raceId } = useParams();
  const { formatDisplayPoleTime } = useFormatters();
  
  const { 
    race, 
    drivers, 
    existingResult,
    refetch,
    loading,
    processPoints
  } = useRaceResults(raceId);

  const [poleTime, setPoleTime] = useState<string>("");
  const [fastestLap, setFastestLap] = useState<string>("");
  
  const { results: qualifyingResults, handleDriverChange: handleQualifyingDriverChange } = 
    useDriverPositions(existingResult?.qualifying_results || Array(20).fill(""));
  
  const { results: raceResults, handleDriverChange: handleRaceDriverChange } = 
    useDriverPositions(existingResult?.race_results || Array(20).fill(""));
  
  const { dnfDrivers, handleDNFChange, handleDNFCount } = 
    useDNFDrivers(existingResult?.dnf_drivers || []);
  
  const { saving, saveResults } = useRaceResultsSave(
    raceId, 
    existingResult, 
    processPoints, 
    refetch
  );

  // Initialize state when existingResult changes
  useEffect(() => {
    if (existingResult) {
      setPoleTime(existingResult.pole_time || "");
      setFastestLap(existingResult.fastest_lap || "");
    }
  }, [existingResult]);

  const handleSaveResults = async () => {
    try {
      await saveResults(
        poleTime,
        fastestLap,
        qualifyingResults,
        raceResults,
        dnfDrivers
      );
      navigate(-1);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  return {
    race,
    drivers,
    poleTime,
    setPoleTime,
    formatDisplayPoleTime,
    fastestLap,
    setFastestLap,
    qualifyingResults,
    handleQualifyingDriverChange,
    raceResults,
    handleRaceDriverChange,
    dnfDrivers,
    handleDNFChange,
    handleDNFCount,
    saving,
    loading,
    handleSaveResults
  };
};
