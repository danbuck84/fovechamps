
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

  const handleDNFCountChange = (value: string) => {
    const count = parseInt(value, 10);
    // Clear current DNF list
    dnfDrivers.forEach(driverId => onDNFChange(driverId, false));
    
    // If selecting a number > 0, we automatically select the first n drivers 
    // as DNF based on the count
    if (count > 0 && allDrivers.length > 0) {
      // Get the first 'count' drivers
      const selectedDrivers = allDrivers.slice(0, count).map(d => d.id);
      
      // Mark them as DNF
      selectedDrivers.forEach(driverId => onDNFChange(driverId, true));
    }
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
                    <SelectContent className="bg-racing-black border-racing-silver/20 max-h-[300px]">
                      <SelectItem value="placeholder" className="text-racing-white">
                        Selecione um piloto
                      </SelectItem>
                      {allDrivers.map((driver) => (
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

          <div className="space-y-4">
            <label className="block text-sm font-medium text-racing-silver">
              Sobreviventes
            </label>
            <Select
              value={dnfDrivers.length.toString()}
              onValueChange={handleDNFCountChange}
            >
              <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
                <SelectValue placeholder="Selecione quantos pilotos sobreviveram" />
              </SelectTrigger>
              <SelectContent className="bg-racing-black border-racing-silver/20">
                {Array.from({ length: 21 }).map((_, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer"
                  >
                    {index} piloto{index !== 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
