
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRaceResults } from "@/hooks/useRaceResults";
import { QualifyingResultsForm } from "@/components/race-results/QualifyingResultsForm";
import { RaceResultsForm } from "@/components/race-results/RaceResultsForm";
import { AdminActionButtons } from "@/components/race-results/AdminActionButtons";
import { useFormatters } from "@/hooks/race/useFormatters";
import { useDriverPositions } from "@/hooks/race/useDriverPositions";
import { useDNFDrivers } from "@/hooks/race/useDNFDrivers";
import { useRaceResultsSave } from "@/hooks/race/useRaceResultsSave";
import { useAvailableDrivers } from "@/hooks/race/useAvailableDrivers";

const RaceResultsAdmin = () => {
  const { raceId } = useParams<{ raceId: string }>();
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
  
  const { getAvailableDrivers } = useAvailableDrivers();
  
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

  const getDriversByPosition = (position: number) => {
    return getAvailableDrivers(position, qualifyingResults, raceResults, drivers);
  };

  const handleSaveResults = async () => {
    await saveResults(
      poleTime,
      fastestLap,
      qualifyingResults,
      raceResults,
      dnfDrivers
    );
  };

  if (!race || !drivers) {
    return <div className="p-6 text-center text-racing-silver">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-racing-white">{race.name} - Resultados Oficiais</h1>
          <AdminActionButtons onSave={handleSaveResults} isLoading={saving || loading} />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <QualifyingResultsForm 
            poleTime={formatDisplayPoleTime(poleTime)}
            onPoleTimeChange={setPoleTime}
            qualifyingResults={qualifyingResults}
            onQualifyingDriverChange={handleQualifyingDriverChange}
            availableDrivers={getDriversByPosition}
          />

          <RaceResultsForm 
            fastestLap={fastestLap}
            onFastestLapChange={setFastestLap}
            raceResults={raceResults}
            onRaceDriverChange={handleRaceDriverChange}
            dnfDrivers={dnfDrivers}
            onDNFChange={handleDNFChange}
            availableDrivers={getDriversByPosition}
            allDrivers={drivers}
          />
        </div>
      </div>
    </div>
  );
};

export default RaceResultsAdmin;
