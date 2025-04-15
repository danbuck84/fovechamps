
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PolePositionSection from "./comparison/PolePositionSection";
import ResultsList from "./comparison/ResultsList";
import AdditionalPredictions from "./comparison/AdditionalPredictions";
import type { Driver, Prediction, RaceResult } from "@/types/betting";

interface ComparisonTableProps {
  prediction: Prediction;
  raceResult: RaceResult;
  drivers: (Driver & { team: { name: string } })[];
  username: string;
}

const ComparisonTable = ({ prediction, raceResult, drivers, username }: ComparisonTableProps) => {
  return (
    <Card className="bg-racing-black border-racing-silver/20 w-full">
      <CardHeader>
        <CardTitle className="text-lg text-racing-white">Apostas de {username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PolePositionSection 
            polePosition={prediction.pole_position}
            poleTime={prediction.pole_time}
            actualPolePosition={raceResult.qualifying_results[0]}
            actualPoleTime={raceResult.pole_time}
            drivers={drivers}
          />

          <ResultsList 
            title="TOP 10 - Classificação"
            predictions={prediction.qualifying_results.slice(0, 10)}
            actualResults={raceResult.qualifying_results}
            drivers={drivers}
            isQualifying={true}
          />

          <ResultsList 
            title="TOP 10 - Corrida"
            predictions={prediction.top_10.slice(0, 10)}
            actualResults={raceResult.race_results}
            drivers={drivers}
          />

          <AdditionalPredictions 
            fastestLap={prediction.fastest_lap}
            actualFastestLap={raceResult.fastest_lap}
            dnfPredictions={prediction.dnf_predictions}
            drivers={drivers}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
