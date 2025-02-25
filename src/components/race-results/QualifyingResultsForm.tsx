
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface QualifyingResultsFormProps {
  poleTime: string;
  onPoleTimeChange: (value: string) => void;
  qualifyingResults: string[];
  onQualifyingDriverChange: (position: number, driverId: string) => void;
  availableDrivers: (position: number) => (Driver & { team: { name: string; engine: string } })[];
}

export const QualifyingResultsForm = ({
  poleTime,
  onPoleTimeChange,
  qualifyingResults,
  onQualifyingDriverChange,
  availableDrivers,
}: QualifyingResultsFormProps) => {
  const sortDrivers = (drivers: (Driver & { team: { name: string; engine: string } })[]) => {
    return [...drivers].sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <Card className="bg-racing-black border-racing-silver/20">
      <CardHeader>
        <CardTitle>Resultados da Classificação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-racing-silver mb-2">
              Tempo da Pole
            </label>
            <input
              type="text"
              value={poleTime}
              onChange={(e) => onPoleTimeChange(e.target.value)}
              placeholder="ex: 1:23.456"
              className="w-full bg-racing-white text-racing-black border border-racing-silver/20 rounded-md p-2"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-racing-silver">
              Grid de Largada
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={`qualifying-${index}`} className="flex items-center gap-2">
                  <span className="w-8 text-racing-silver">{index + 1}.</span>
                  <Select
                    value={qualifyingResults[index] || "placeholder"}
                    onValueChange={(value) => onQualifyingDriverChange(index, value)}
                  >
                    <SelectTrigger className="w-full bg-racing-white text-racing-black border-racing-silver/20">
                      <SelectValue placeholder="Selecione um piloto" />
                    </SelectTrigger>
                    <SelectContent className="bg-racing-white border-racing-silver/20">
                      <SelectItem value="placeholder" className="text-racing-black">
                        Selecione um piloto
                      </SelectItem>
                      {sortDrivers(availableDrivers(index)).map((driver) => (
                        <SelectItem 
                          key={driver.id} 
                          value={driver.id}
                          className="hover:bg-racing-black hover:text-racing-white focus:bg-racing-black focus:text-racing-white cursor-pointer"
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

