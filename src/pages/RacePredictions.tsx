
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RacePredictionsHeader } from "@/components/race-predictions/RacePredictionsHeader";
import { RaceInfoHeader } from "@/components/race-predictions/RaceInfoHeader";
import { PredictionForm } from "@/components/race-predictions/PredictionForm";
import { ExistingPredictionCard } from "@/components/race-predictions/ExistingPredictionCard";
import { RacePredictionLoading } from "@/components/race-predictions/RacePredictionLoading";
import { RacePredictionNotFound } from "@/components/race-predictions/RacePredictionNotFound";
import { DeadlinePassedView } from "@/components/race-predictions/DeadlinePassedView";
import { useRacePrediction } from "@/hooks/useRacePrediction";
import { ScrollArea } from "@/components/ui/scroll-area";

const RacePredictions = () => {
  const { raceId } = useParams();
  const {
    race,
    drivers,
    poleTime,
    handlePoleTimeChange,
    fastestLap,
    setFastestLap,
    qualifyingTop10,
    setQualifyingTop10,
    raceTop10,
    setRaceTop10,
    dnfPredictions,
    handleDriverDNF,
    getAvailableDrivers,
    isAdmin,
    isLoadingRace,
    isLoadingDrivers,
    isDeadlinePassed,
    existingPrediction,
    setExistingPrediction,
    handleSubmit,
    navigate
  } = useRacePrediction(raceId);

  if (isLoadingRace || isLoadingDrivers) {
    return <RacePredictionLoading />;
  }

  if (!race || !drivers) {
    return <RacePredictionNotFound />;
  }

  if (existingPrediction && !isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white">
        <div className="container mx-auto px-4 py-8">
          <RacePredictionsHeader onBack={() => navigate(-1)} />
          <ExistingPredictionCard
            race={race}
            isDeadlinePassed={isDeadlinePassed}
            onEdit={() => setExistingPrediction(null)}
            onViewPredictions={() => navigate("/my-predictions")}
          />
          {isAdmin && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => navigate(`/admin/race-results/${raceId}`)}
                className="bg-racing-red hover:bg-racing-red/90 min-h-[44px]"
              >
                Editar Resultados
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isDeadlinePassed) {
    return (
      <DeadlinePassedView
        race={race}
        isDeadlinePassed={isDeadlinePassed}
        onBack={() => navigate(-1)}
        onViewPredictions={() => navigate("/my-predictions")}
        onEditResults={() => navigate(`/admin/race-results/${raceId}`)}
        isAdmin={isAdmin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <RacePredictionsHeader onBack={() => navigate(-1)} />

        <Card className="bg-racing-black border-racing-silver/20">
          <RaceInfoHeader 
            race={race}
            isDeadlinePassed={isDeadlinePassed}
          />
          <CardContent>
            <ScrollArea className="h-full pr-4" type="always">
              <PredictionForm
                drivers={drivers}
                poleTime={poleTime}
                onPoleTimeChange={handlePoleTimeChange}
                qualifyingTop10={qualifyingTop10}
                setQualifyingTop10={setQualifyingTop10}
                raceTop10={raceTop10}
                setRaceTop10={setRaceTop10}
                dnfPredictions={dnfPredictions}
                onDriverDNF={handleDriverDNF}
                getAvailableDrivers={getAvailableDrivers}
                isDeadlinePassed={isDeadlinePassed}
                onSubmit={handleSubmit}
                fastestLap={fastestLap}
                setFastestLap={setFastestLap}
              />
            </ScrollArea>
            {isAdmin && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => navigate(`/admin/race-results/${raceId}`)}
                  className="bg-racing-red hover:bg-racing-red/90 min-h-[44px]"
                >
                  Editar Resultados
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
