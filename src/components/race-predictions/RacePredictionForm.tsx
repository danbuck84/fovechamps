
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
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
}

export const RacePredictionForm = ({
  raceTop10,
  setRaceTop10,
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
                  <SelectTrigger className="bg-racing-white text-racing-black border-racing-silver/20">
                    <SelectValue placeholder="Selecione um piloto" />
                  </SelectTrigger>
                  <SelectContent className="bg-racing-white border-racing-silver/20">
                    {getAvailableDrivers(index, false).map((driver) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
