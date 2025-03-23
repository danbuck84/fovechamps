
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Flag, Timer, Award } from "lucide-react";
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-racing-silver/20 bg-racing-black text-racing-white overflow-hidden">
        <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
          <CardTitle className="flex items-center">
            <Flag className="h-5 w-5 mr-2 text-racing-red" />
            Resultado da Corrida
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-racing-silver/10">
            {result.race_results.map((driverId, index) => (
              <div key={`race-${index}`} className="flex items-center px-4 py-2 hover:bg-racing-silver/5">
                <span className="w-8 font-bold text-racing-red">{index + 1}</span>
                <div className="flex-1">
                  <div className="font-medium text-racing-white">{getDriverName(driverId)}</div>
                  <div className="text-sm text-racing-silver">{getDriverTeam(driverId)}</div>
                </div>
                {fastestLap === driverId && (
                  <div className="ml-2 px-2 py-1 rounded bg-purple-900/40 text-purple-300 text-xs flex items-center">
                    <Timer className="w-3 h-3 mr-1" />
                    Volta mais rápida
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-racing-silver/20 bg-racing-black text-racing-white overflow-hidden">
        <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-racing-red" />
            Grid de Largada
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-racing-silver/10">
            {result.qualifying_results.map((driverId, index) => (
              <div key={`qualifying-${index}`} className="flex items-center px-4 py-2 hover:bg-racing-silver/5">
                <span className="w-8 font-bold text-racing-red">{index + 1}</span>
                <div className="flex-1">
                  <div className="font-medium text-racing-white">{getDriverName(driverId)}</div>
                  <div className="text-sm text-racing-silver">{getDriverTeam(driverId)}</div>
                </div>
                {index === 0 && (
                  <div className="ml-2 px-2 py-1 rounded bg-yellow-900/40 text-yellow-300 text-xs">
                    Pole Position
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-racing-silver/20 bg-racing-black text-racing-white md:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle>Detalhes adicionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">
                Pilotos que sobreviveram ao GP
              </h3>
              <div className="flex flex-wrap gap-2">
                {dnfDrivers.map((driverId) => (
                  <span
                    key={driverId}
                    className="inline-block bg-racing-silver/10 px-3 py-1.5 rounded-full text-sm"
                  >
                    {getDriverName(driverId)}
                  </span>
                ))}
                {dnfDrivers.length === 0 && (
                  <span className="text-racing-silver italic">Nenhum piloto sobrevivente registrado</span>
                )}
              </div>
            </div>

            {result.pole_time && (
              <div>
                <h3 className="text-sm font-medium text-racing-silver mb-2">
                  Volta da Pole Position
                </h3>
                <p className="text-racing-white font-mono bg-racing-silver/10 px-3 py-1.5 rounded-md inline-block">
                  {result.pole_time}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
