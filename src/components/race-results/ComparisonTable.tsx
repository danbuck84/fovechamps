
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, AlertTriangle } from "lucide-react";
import type { Driver, Prediction, RaceResult } from "@/types/betting";

interface ComparisonTableProps {
  prediction: Prediction;
  raceResult: RaceResult;
  drivers: (Driver & { team: { name: string } })[];
  username: string;
}

const ComparisonTable = ({ prediction, raceResult, drivers, username }: ComparisonTableProps) => {
  const getDriverName = (driverId: string) => {
    if (!driverId) return "Piloto não selecionado";
    const driver = drivers.find(d => d.id === driverId);
    return driver ? `${driver.name} (${driver.team.name})` : "Piloto não encontrado";
  };

  const isPredictionCorrect = (predictedDriverId: string, resultIndex: number): boolean => {
    return raceResult.race_results[resultIndex] === predictedDriverId;
  };

  const isPredictionOffByOne = (predictedDriverId: string, resultIndex: number): boolean => {
    // Verifica se o piloto está uma posição acima ou abaixo da prevista
    return (
      raceResult.race_results[resultIndex - 1] === predictedDriverId ||
      raceResult.race_results[resultIndex + 1] === predictedDriverId
    );
  };

  const isQualifyingPredictionCorrect = (predictedDriverId: string, resultIndex: number): boolean => {
    return raceResult.qualifying_results[resultIndex] === predictedDriverId;
  };

  const isQualifyingPredictionOffByOne = (predictedDriverId: string, resultIndex: number): boolean => {
    // Verifica se o piloto está uma posição acima ou abaixo da prevista
    return (
      raceResult.qualifying_results[resultIndex - 1] === predictedDriverId ||
      raceResult.qualifying_results[resultIndex + 1] === predictedDriverId
    );
  };

  const getActualPosition = (driverId: string, isQualifying: boolean = false): number => {
    const results = isQualifying ? raceResult.qualifying_results : raceResult.race_results;
    return results.findIndex(id => id === driverId) + 1;
  };

  return (
    <Card className="bg-racing-black border-racing-silver/20">
      <CardHeader>
        <CardTitle className="text-lg text-racing-white">Apostas de {username}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Pole Position</h3>
              <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{getDriverName(prediction.pole_position)}</span>
                {prediction.pole_position === raceResult.qualifying_results[0] && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Tempo da Pole</h3>
              <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{prediction.pole_time}</span>
                {prediction.pole_time === raceResult.pole_time && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Classificação</h3>
            <div className="space-y-2">
              {prediction.qualifying_results.slice(0, 10).map((driverId, index) => {
                const isCorrect = isQualifyingPredictionCorrect(driverId, index);
                const isOffByOne = !isCorrect && isQualifyingPredictionOffByOne(driverId, index);
                const actualPos = getActualPosition(driverId, true);
                
                return (
                  <div 
                    key={`qual-${index}`}
                    className="flex justify-between items-center p-2 bg-racing-silver/10 rounded"
                  >
                    <span className="text-racing-white">
                      {index + 1}. {getDriverName(driverId)}
                    </span>
                    <div className="flex items-center">
                      {isOffByOne && (
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-yellow-500 text-xs font-medium">P{actualPos}</span>
                        </div>
                      )}
                      {isCorrect && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Corrida</h3>
            <div className="space-y-2">
              {prediction.top_10.slice(0, 10).map((driverId, index) => {
                const isCorrect = isPredictionCorrect(driverId, index);
                const isOffByOne = !isCorrect && isPredictionOffByOne(driverId, index);
                const actualPos = getActualPosition(driverId);
                
                return (
                  <div 
                    key={`race-${index}`}
                    className="flex justify-between items-center p-2 bg-racing-silver/10 rounded"
                  >
                    <span className="text-racing-white">
                      {index + 1}. {getDriverName(driverId)}
                    </span>
                    <div className="flex items-center">
                      {isOffByOne && (
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-yellow-500 text-xs font-medium">P{actualPos}</span>
                        </div>
                      )}
                      {isCorrect && (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Volta Mais Rápida</h3>
              <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{getDriverName(prediction.fastest_lap || '')}</span>
                {prediction.fastest_lap === raceResult.fastest_lap && (
                  <Check className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Pilotos que não terminam</h3>
              <div className="p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{prediction.dnf_predictions.length} DNFs</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonTable;
