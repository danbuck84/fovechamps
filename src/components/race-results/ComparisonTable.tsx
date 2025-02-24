import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
                  <span className="text-green-500">✓</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Tempo da Pole</h3>
              <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{prediction.pole_time}</span>
                {prediction.pole_time === raceResult.pole_time && (
                  <span className="text-green-500">✓</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Classificação</h3>
            <div className="space-y-2">
              {prediction.qualifying_results.slice(0, 10).map((driverId, index) => (
                <div 
                  key={`qual-${index}`}
                  className="flex justify-between items-center p-2 bg-racing-silver/10 rounded"
                >
                  <span className="text-racing-white">
                    {index + 1}. {getDriverName(driverId)}
                  </span>
                  {raceResult.qualifying_results[index] === driverId && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Corrida</h3>
            <div className="space-y-2">
              {prediction.top_10.slice(0, 10).map((driverId, index) => (
                <div 
                  key={`race-${index}`}
                  className="flex justify-between items-center p-2 bg-racing-silver/10 rounded"
                >
                  <span className="text-racing-white">
                    {index + 1}. {getDriverName(driverId)}
                  </span>
                  {raceResult.race_results[index] === driverId && (
                    <span className="text-green-500">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Volta Mais Rápida</h3>
              <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
                <span className="text-racing-white">{getDriverName(prediction.fastest_lap || '')}</span>
                {prediction.fastest_lap === raceResult.fastest_lap && (
                  <span className="text-green-500">✓</span>
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
