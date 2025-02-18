
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface RacePredictionFormProps {
  raceTop10: string[];
  setRaceTop10: (value: string[]) => void;
  dnfPredictions: string[];
  onDriverDNF: (driverId: string) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
}

export const RacePredictionForm = ({
  raceTop10,
  setRaceTop10,
  dnfPredictions,
  onDriverDNF,
  getAvailableDrivers,
  allDrivers,
  disabled = false,
}: RacePredictionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Palpites da Corrida</h3>
        <p className="text-sm text-racing-silver">
          Faça seus palpites para o resultado final da corrida, prevendo as 11 primeiras posições.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {raceTop10.map((_, index) => (
          <div key={`race-${index}`} className="space-y-2">
            <label className="text-sm text-racing-silver">
              {index + 1}º Lugar
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select
                  value={raceTop10[index]}
                  onValueChange={(value) => {
                    const newTop10 = [...raceTop10];
                    newTop10[index] = value;
                    setRaceTop10(newTop10);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                    <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
                  </SelectTrigger>
                  <SelectContent className="bg-racing-black border-racing-silver/20">
                    {getAvailableDrivers(index, false).map((driver) => (
                      <SelectItem key={driver.id} value={driver.id} className="text-racing-white hover:bg-racing-silver/20">
                        {driver.name} ({driver.team.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <h4 className="text-lg font-semibold">Previsões de DNF</h4>
        <p className="text-sm text-racing-silver">
          Selecione os pilotos que você acredita que não completarão a corrida.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDrivers.map((driver) => {
            const isSelected = raceTop10.includes(driver.id);
            return (
              <div
                key={driver.id}
                className={`flex items-center space-x-2 p-2 rounded ${
                  isSelected ? 'bg-racing-silver/10' : ''
                }`}
              >
                <Checkbox
                  id={`dnf-${driver.id}`}
                  checked={dnfPredictions.includes(driver.id)}
                  onCheckedChange={() => onDriverDNF(driver.id)}
                  className="h-5 w-5 border-2 border-racing-silver/50 data-[state=checked]:bg-racing-red data-[state=checked]:border-racing-red"
                  disabled={disabled}
                />
                <label
                  htmlFor={`dnf-${driver.id}`}
                  className={`text-sm font-medium cursor-pointer select-none ${
                    isSelected ? 'text-racing-white font-semibold' : 'text-racing-silver'
                  }`}
                >
                  {driver.name} ({driver.team.name})
                  {isSelected && ` - ${raceTop10.indexOf(driver.id) + 1}º`}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
