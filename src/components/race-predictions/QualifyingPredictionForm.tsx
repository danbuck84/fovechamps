
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
        <h3 className="text-xl font-semibold text-racing-white">Acerte o Grid</h3>
        <p className="text-sm text-racing-silver">
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
            <label className="text-sm text-racing-silver">
              {index + 1}º Lugar
            </label>
            <Select
              value={driverId || ""}
              onValueChange={(value) => {
                const newTop10 = [...qualifyingTop10];
                newTop10[index] = value;
                setQualifyingTop10(newTop10);
              }}
              disabled={disabled}
            >
              <SelectTrigger 
                className={`bg-racing-white text-racing-black border-racing-silver/20 ${!driverId ? "border-racing-red" : ""}`}
              >
                <SelectValue placeholder="Selecione um piloto" />
              </SelectTrigger>
              <SelectContent className="bg-racing-white border-racing-silver/20">
                <SelectItem value="" className="hover:bg-racing-black hover:text-racing-white focus:bg-racing-black focus:text-racing-white cursor-pointer">
                  Selecione um piloto
                </SelectItem>
                {getAvailableDrivers(index).map((driver) => (
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
  );
});

QualifyingPredictionForm.displayName = "QualifyingPredictionForm";
