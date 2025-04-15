
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PastRacesList } from "@/components/past-predictions/PastRacesList";
import { RaceResultsCard } from "@/components/past-predictions/RaceResultsCard";
import { UserPredictionsCard } from "@/components/past-predictions/UserPredictionsCard";
import { EmptySelectionCard } from "@/components/past-predictions/EmptySelectionCard";
import { usePastRaces } from "@/hooks/past-predictions/usePastRaces";
import { useRacePredictions } from "@/hooks/past-predictions/useRacePredictions";
import { useRaceResult } from "@/hooks/past-predictions/useRaceResult";
import { useDrivers } from "@/hooks/past-predictions/useDrivers";

const PastPredictions = () => {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);

  // Fetch data using custom hooks
  const { data: pastRaces, isLoading: loadingRaces } = usePastRaces();
  const { data: predictions, isLoading: loadingPredictions } = useRacePredictions(selectedRaceId);
  const { data: raceResult, isLoading: loadingResult } = useRaceResult(selectedRaceId);
  const { data: drivers } = useDrivers();

  // Function to get driver name by ID
  const getDriverName = (driverId: string) => {
    if (!drivers) return "Carregando...";
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : "Piloto não encontrado";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-racing-white mb-8">Apostas Passadas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-racing-black border-racing-silver/20 col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Corridas Passadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PastRacesList 
              races={pastRaces || []}
              selectedRaceId={selectedRaceId}
              onRaceSelect={setSelectedRaceId}
              isLoading={loadingRaces}
            />
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedRaceId ? (
            <>
              <RaceResultsCard 
                raceId={selectedRaceId}
                raceResult={raceResult}
                isLoading={loadingResult}
                getDriverName={getDriverName}
              />
              
              <UserPredictionsCard 
                raceId={selectedRaceId}
                predictions={predictions || []}
                isLoading={loadingPredictions}
                getDriverName={getDriverName}
              />
            </>
          ) : (
            <EmptySelectionCard />
          )}
        </div>
      </div>
    </div>
  );
};

export default PastPredictions;
