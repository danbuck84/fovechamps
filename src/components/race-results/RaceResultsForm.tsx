import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Driver } from "@/types/betting";
import "@/styles/select-styles.css";

interface RaceResultsFormProps {
  fastestLap: string;
  onFastestLapChange: (value: string) => void;
  raceResults: string[];
  onRaceDriverChange: (position: number, driverId: string) => void;
  dnfDrivers: string[];
  onDNFChange: (driverId: string, checked: boolean) => void;
  availableDrivers: (position: number) => (Driver & { team: { name: string; engine: string } })[];
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
}

export const RaceResultsForm = ({
  fastestLap,
  onFastestLapChange,
  raceResults,
  onRaceDriverChange,
  dnfDrivers,
  onDNFChange,
  availableDrivers,
  allDrivers,
}: RaceResultsFormProps) => {
  const sortDrivers = (drivers: (Driver & { team: { name: string; engine: string } })[]) => {
    return [...drivers].sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <Card className="bg-racing-black border-racing-silver/20">
      <CardHeader>
        <CardTitle>Resultados da Corrida</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-racing-silver mb-2">
              Volta Mais Rápida
            </label>
            <select
              value={fastestLap}
              onChange={(e) => onFastestLapChange(e.target.value)}
              className="race-select w-full border border-racing-silver/20 rounded-md p-2 cursor-pointer"
            >
              <option value="">Selecione um piloto</option>
              {sortDrivers(allDrivers).map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-racing-silver">
              Grid de Chegada
            </label>
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={`race-${index}`} className="flex items-center gap-2">
                <span className="w-8 text-racing-silver">{index + 1}.</span>
                <select
                  value={raceResults[index] || ""}
                  onChange={(e) => onRaceDriverChange(index, e.target.value)}
                  className="race-select flex-1 border border-racing-silver/20 rounded-md p-2 cursor-pointer"
                >
                  <option value="">Selecione um piloto</option>
                  {sortDrivers(availableDrivers(index)).map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.team.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`dnf-${index}`}
                    checked={dnfDrivers.includes(raceResults[index] || "")}
                    onCheckedChange={(checked) => {
                      const driverId = raceResults[index];
                      if (driverId) {
                        onDNFChange(driverId, checked as boolean);
                      }
                    }}
                    disabled={!raceResults[index]}
                  />
                  <label
                    htmlFor={`dnf-${index}`}
                    className="text-sm font-medium text-racing-silver leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    DNF
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
