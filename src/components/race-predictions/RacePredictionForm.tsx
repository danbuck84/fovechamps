
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
  disabled?: boolean;
}

export const RacePredictionForm = ({
  raceTop10,
  setRaceTop10,
  dnfPredictions,
  onDriverDNF,
  getAvailableDrivers,
  disabled = false,
}: RacePredictionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Palpites da Corrida</h3>
        <p className="text-sm text-racing-silver">
          Faça seus palpites para o resultado final da corrida, prevendo as 10 primeiras posições.
          Marque o checkbox ao lado do piloto caso você ache que ele não completará a prova (DNF).
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
              {raceTop10[index] && (
                <div className="flex items-center space-x-2 min-w-[80px]">
                  <Checkbox
                    id={`dnf-${raceTop10[index]}`}
                    checked={dnfPredictions.includes(raceTop10[index])}
                    onCheckedChange={() => onDriverDNF(raceTop10[index])}
                    className="h-5 w-5 border-2 border-racing-silver/50 data-[state=checked]:bg-racing-red data-[state=checked]:border-racing-red"
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`dnf-${raceTop10[index]}`}
                    className="text-sm font-medium text-racing-silver cursor-pointer select-none"
                  >
                    DNF
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
