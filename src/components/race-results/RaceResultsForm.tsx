
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

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
            <Select
              value={fastestLap || "placeholder"}
              onValueChange={onFastestLapChange}
            >
              <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
                <SelectValue placeholder="Selecione um piloto" />
              </SelectTrigger>
              <SelectContent className="bg-racing-black border-racing-silver/20">
                <SelectItem value="placeholder" className="text-racing-white">
                  Selecione um piloto
                </SelectItem>
                {sortDrivers(allDrivers).map((driver) => (
                  <SelectItem 
                    key={driver.id} 
                    value={driver.id}
                    className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer"
                  >
                    {driver.name} ({driver.team.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-racing-silver">
              Grid de Chegada
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={`race-${index}`} className="flex items-center gap-2">
                  <span className="w-8 text-racing-silver">{index + 1}.</span>
                  <Select
                    value={raceResults[index] || "placeholder"}
                    onValueChange={(value) => onRaceDriverChange(index, value)}
                  >
                    <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
                      <SelectValue placeholder="Selecione um piloto" />
                    </SelectTrigger>
                    <SelectContent className="bg-racing-black border-racing-silver/20">
                      <SelectItem value="placeholder" className="text-racing-white">
                        Selecione um piloto
                      </SelectItem>
                      {sortDrivers(availableDrivers(index)).map((driver) => (
                        <SelectItem 
                          key={driver.id} 
                          value={driver.id}
                          className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer"
                        >
                          {driver.name} ({driver.team.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

