
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ComparisonTable from "@/components/race-results/ComparisonTable";
import type { Prediction, RaceResult, Driver } from "@/types/betting";

interface PredictionsSectionProps {
  predictions: (Prediction & { profiles: { username: string } })[];
  raceResult: RaceResult;
  drivers: (Driver & { team: { name: string; engine: string } })[];
  isDeadlinePassed: boolean;
}

export const PredictionsSection = ({
  predictions,
  raceResult,
  drivers,
  isDeadlinePassed,
}: PredictionsSectionProps) => {
  if (!isDeadlinePassed) {
    return (
      <Card className="bg-racing-black border-racing-silver/20">
        <CardHeader>
          <CardTitle>Apostas dos Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-racing-silver">As apostas serão exibidas após o encerramento do prazo (classificação).</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Apostas dos Participantes</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction) => (
          <ComparisonTable
            key={prediction.id}
            prediction={prediction}
            raceResult={raceResult}
            drivers={drivers}
            username={prediction.profiles.username}
          />
        ))}
      </div>
    </div>
  );
};
