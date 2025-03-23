
import { useParams, useNavigate } from "react-router-dom";
import { isDeadlinePassed } from "@/utils/date-utils";
import { RaceResultsView } from "@/components/race-results/RaceResultsView";
import { RaceHeader } from "@/components/race-results/RaceHeader";
import { PredictionsSection } from "@/components/race-results/PredictionsSection";
import { useRaceResults } from "@/hooks/useRaceResults";
import MainLayout from "@/components/layout/MainLayout";
import type { RaceResult } from "@/types/betting";

const RaceResults = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { 
    race, 
    drivers, 
    raceResult, 
    predictions, 
    isLoadingDrivers, 
    calculatingPoints, 
    processPoints,
    loading: isLoading
  } = useRaceResults(raceId);

  // Check if deadline has passed
  const deadlinePassed = race ? isDeadlinePassed(race.qualifying_date) : false;

  if (isLoading || isLoadingDrivers || !race || !drivers || !raceResult) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  // Safely cast to RaceResult type and provide defaults for any missing properties
  const typedRaceResult = raceResult as RaceResult;
  const dnfDrivers = typedRaceResult.dnf_drivers || [];

  return (
    <MainLayout>
      <div className="bg-racing-black text-racing-white w-full">
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
              result={typedRaceResult}
              drivers={drivers}
              fastestLap={typedRaceResult.fastest_lap}
              dnfDrivers={dnfDrivers}
            />
          </div>

          {/* Apostas dos Usuários - Só mostrar se o prazo encerrou */}
          <PredictionsSection 
            predictions={predictions}
            raceResult={typedRaceResult}
            drivers={drivers}
            isDeadlinePassed={deadlinePassed}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default RaceResults;
