
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
            {Array.from({ length: 20 }).map((_, index) => (
              <div key={`qualifying-${index}`} className="flex items-center gap-2">
                <span className="w-8 text-racing-silver">{index + 1}.</span>
                <select
                  value={qualifyingResults[index] || ""}
                  onChange={(e) => onQualifyingDriverChange(index, e.target.value)}
                  className="flex-1 bg-racing-white text-racing-black border border-racing-silver/20 rounded-md p-2 cursor-pointer [&>option]:bg-racing-white [&>option]:text-racing-black [&>option:hover]:bg-racing-black [&>option:hover]:text-racing-white"
                >
                  <option value="">Selecione um piloto</option>
                  {sortDrivers(availableDrivers(index)).map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.team.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
