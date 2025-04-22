
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";
import { forwardRef } from "react";

interface QualifyingPredictionFormProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  qualifyingTop10: string[];
  setQualifyingTop10: (value: string[]) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
  positionRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export const QualifyingPredictionForm = forwardRef<HTMLDivElement, QualifyingPredictionFormProps>(({
  qualifyingTop10,
  setQualifyingTop10,
  getAvailableDrivers,
  disabled = false,
  positionRefs,
}, ref) => {
  return (
    <div ref={ref} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-fove-white">Acerte o Grid</h3>
        <p className="text-sm text-fove-silver">
          Tente acertar exatamente a posição de cada piloto no grid de largada após a classificação.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualifyingTop10.map((driverId, index) => (
          <div 
            key={`qual-${index}`} 
            className="space-y-2"
            ref={el => positionRefs && (positionRefs.current[index] = el)}
          >
            <label className="text-sm text-fove-silver">
              {index + 1}º Lugar
            </label>
            <Select
              value={driverId || undefined}
              onValueChange={(value) => {
                const newTop10 = [...qualifyingTop10];
                newTop10[index] = value;
                setQualifyingTop10(newTop10);
              }}
              disabled={disabled}
            >
              <SelectTrigger 
                className={`bg-fove-white text-fove-black border-fove-silver/20 min-h-[44px] ${!driverId ? "border-fove-red" : ""}`}
              >
                <SelectValue placeholder="Selecione um piloto" />
              </SelectTrigger>
              <SelectContent 
                className="bg-fove-white border-fove-silver/20"
                position="popper"
                sideOffset={5}
                align="start"
                avoidCollisions={true}
              >
                <SelectItem 
                  value="placeholder" 
                  className="hover:bg-fove-black hover:text-fove-white focus:bg-fove-black focus:text-fove-white cursor-pointer py-3"
                >
                  Selecione um piloto
                </SelectItem>
                {getAvailableDrivers(index).map((driver) => (
                  <SelectItem 
                    key={driver.id} 
                    value={driver.id}
                    className="hover:bg-fove-black hover:text-fove-white focus:bg-fove-black focus:text-fove-white cursor-pointer py-3"
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

QualifyingPredictionForm.displayName = "QualifyingPredictionForm";
