
import { useNavigate } from "react-router-dom";
import { isDeadlinePassed } from "@/utils/date-utils";
import { RaceResultsView } from "@/components/race-results/RaceResultsView";
import { RaceHeader } from "@/components/race-results/RaceHeader";
import { PredictionsSection } from "@/components/race-results/PredictionsSection";
import { useRaceResults } from "@/hooks/useRaceResults";

const RaceResults = () => {
  const navigate = useNavigate();
  const { 
    race, 
    drivers, 
    raceResult, 
    predictions, 
    isLoadingDrivers, 
    calculatingPoints, 
    processPoints 
  } = useRaceResults();

  // Check if deadline has passed
  const deadlinePassed = race ? isDeadlinePassed(race.qualifying_date) : false;

  if (!race || !drivers || !raceResult || !predictions || isLoadingDrivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  const dnfDrivers = raceResult.dnf_drivers || [];

  return (
    <div className="bg-racing-black text-racing-white">
      <div className="container p-4 md:p-6">
        <RaceHeader 
          raceName={race.name}
          onBack={() => navigate(-1)}
          onCalculatePoints={processPoints}
          isCalculating={calculatingPoints}
        />

        {/* Resultados Oficiais */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Resultados Oficiais</h2>
          <RaceResultsView 
            result={raceResult}
            drivers={drivers}
            fastestLap={raceResult.fastest_lap}
            dnfDrivers={dnfDrivers}
          />
        </div>

        {/* Apostas dos Usuários - Só mostrar se o prazo encerrou */}
        <PredictionsSection 
          predictions={predictions}
          raceResult={raceResult}
          drivers={drivers}
          isDeadlinePassed={deadlinePassed}
        />
      </div>
    </div>
  );
};

export default RaceResults;
