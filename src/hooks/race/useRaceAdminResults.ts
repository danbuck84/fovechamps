
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRaceResults } from "@/hooks/useRaceResults";
import { useDriverPositions } from "@/hooks/race/useDriverPositions";
import { useDNFDrivers } from "@/hooks/race/useDNFDrivers";
import { useRaceResultsSave } from "@/hooks/race/useRaceResultsSave";
import { useFormatters } from "@/hooks/race/useFormatters";
import { toast } from "sonner";
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
  
  const { 
    results: qualifyingResults, 
    handleDriverChange: handleQualifyingDriverChange,
    duplicates: qualifyingDuplicates,
    hasDuplicates: hasQualifyingDuplicates,
    getDuplicatedDrivers: getQualifyingDuplicatedDrivers 
  } = useDriverPositions(existingResult?.qualifying_results || Array(20).fill(""));
  
  const { 
    results: raceResults, 
    handleDriverChange: handleRaceDriverChange,
    duplicates: raceDuplicates,
    hasDuplicates: hasRaceDuplicates,
    getDuplicatedDrivers: getRaceDuplicatedDrivers
  } = useDriverPositions(existingResult?.race_results || Array(20).fill(""));
  
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

  const handleDNFCountChange = (value: string) => {
    const count = parseInt(value, 10);
    console.log("Changing survivors count to:", count);
    handleDNFCount(count);
  };

  const handleSaveResults = async () => {
    // Check for duplicates in both qualifying and race results
    if (hasQualifyingDuplicates) {
      const duplicatedDrivers = getQualifyingDuplicatedDrivers();
      const driverNames = duplicatedDrivers.map(driverId => {
        const driver = drivers?.find(d => d.id === driverId);
        return driver ? driver.name : 'Driver';
      }).join(', ');
      
      toast.error(`Duplicates in qualifying: ${driverNames}. Please fix before saving.`);
      return;
    }

    if (hasRaceDuplicates) {
      const duplicatedDrivers = getRaceDuplicatedDrivers();
      const driverNames = duplicatedDrivers.map(driverId => {
        const driver = drivers?.find(d => d.id === driverId);
        return driver ? driver.name : 'Driver';
      }).join(', ');
      
      toast.error(`Duplicates in race results: ${driverNames}. Please fix before saving.`);
      return;
    }

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
    qualifyingDuplicates,
    raceResults,
    handleRaceDriverChange,
    raceDuplicates,
    dnfDrivers,
    handleDNFChange,
    handleDNFCount,
    saving,
    loading,
    handleSaveResults
  };
};
