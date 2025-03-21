
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";
import { forwardRef } from "react";

interface RacePredictionFormProps {
  raceTop10: string[];
  setRaceTop10: (value: string[]) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
  positionRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const RacePredictionForm = forwardRef<HTMLDivElement, RacePredictionFormProps>(({
  raceTop10,
  setRaceTop10,
  getAvailableDrivers,
  disabled = false,
  positionRefs,
}, ref) => {
  return (
    <div ref={ref} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-racing-white">Palpites</h3>
        <p className="text-sm text-racing-silver">
          Faça seus palpites para o resultado final da corrida.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {raceTop10.map((driverId, index) => (
          <div 
            key={`race-${index}`} 
            className="space-y-2"
            ref={el => positionRefs && (positionRefs.current[index] = el)}
          >
            <label className="text-sm text-racing-silver">
              {index + 1}º Lugar
            </label>
            <Select
              value={driverId || undefined}
              onValueChange={(value) => {
                const newTop10 = [...raceTop10];
                newTop10[index] = value;
                setRaceTop10(newTop10);
              }}
              disabled={disabled}
            >
              <SelectTrigger 
                className={`bg-racing-black text-racing-white border-racing-silver/20 ${!driverId ? "border-racing-red" : ""}`}
              >
                <SelectValue placeholder="Selecione um piloto" />
              </SelectTrigger>
              <SelectContent className="bg-racing-black border-racing-silver/20">
                <SelectItem value="placeholder" className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer">
                  Selecione um piloto
                </SelectItem>
                {getAvailableDrivers(index, false).map((driver) => (
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
  );
});

RacePredictionForm.displayName = "RacePredictionForm";
