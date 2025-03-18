
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Driver, RaceResult } from "@/types/betting";

interface RaceResultsViewProps {
  result: RaceResult;
  drivers: (Driver & { team?: { name: string; engine: string } })[];
  fastestLap: string | null;
  dnfDrivers: string[];
}

export const RaceResultsView = ({
  result,
  drivers,
  fastestLap,
  dnfDrivers,
}: RaceResultsViewProps) => {
  // Function to get driver name by ID
  const getDriverName = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver ? driver.name : "Desconhecido";
  };

  // Function to get driver team by ID
  const getDriverTeam = (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId);
    return driver && driver.team ? driver.team.name : "Desconhecido";
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="border-racing-silver/20 bg-racing-black text-racing-white">
        <CardHeader className="pb-3">
          <CardTitle>Resultado Oficial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Resultado da Corrida</h3>
              <div className="space-y-1">
                {result.race_results.map((driverId, index) => (
                  <div key={`race-${index}`} className="flex items-center text-sm">
                    <span className="w-6 text-racing-silver">{index + 1}.</span>
                    <span className="font-medium">{getDriverName(driverId)}</span>
                    <span className="ml-2 text-racing-silver">({getDriverTeam(driverId)})</span>
                    {fastestLap === driverId && (
                      <span className="ml-2 text-purple-500 text-xs">
                        Volta mais rápida
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-racing-silver/20" />

            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">Grid de Largada</h3>
              <div className="space-y-1">
                {result.qualifying_results.map((driverId, index) => (
                  <div key={`qualifying-${index}`} className="flex items-center text-sm">
                    <span className="w-6 text-racing-silver">{index + 1}.</span>
                    <span className="font-medium">{getDriverName(driverId)}</span>
                    <span className="ml-2 text-racing-silver">({getDriverTeam(driverId)})</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-racing-silver/20" />

            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">
                Pilotos que sobreviveram ao GP
              </h3>
              <div className="flex flex-wrap gap-1">
                {dnfDrivers.map((driverId) => (
                  <span
                    key={driverId}
                    className="inline-block bg-racing-silver/10 px-2 py-1 rounded text-sm mr-2 mb-2"
                  >
                    {getDriverName(driverId)}
                  </span>
                ))}
              </div>
            </div>

            {result.pole_time && (
              <>
                <Separator className="bg-racing-silver/20" />
                <div>
                  <h3 className="text-sm font-medium text-racing-silver mb-2">
                    Volta da Pole Position
                  </h3>
                  <p className="text-racing-white font-mono">{result.pole_time}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
