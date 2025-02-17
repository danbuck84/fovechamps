
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface QualifyingPredictionFormProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  qualifyingTop10: string[];
  setQualifyingTop10: (value: string[]) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
}

export const QualifyingPredictionForm = ({
  qualifyingTop10,
  setQualifyingTop10,
  getAvailableDrivers,
  disabled = false,
}: QualifyingPredictionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Acerte o Grid</h3>
        <p className="text-sm text-racing-silver">
          Tente acertar exatamente a posição de cada piloto no grid de largada após a classificação.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qualifyingTop10.map((_, index) => (
          <div key={`qual-${index}`} className="space-y-2">
            <label className="text-sm text-racing-silver">
              {index + 1}º Lugar
            </label>
            <Select
              value={qualifyingTop10[index]}
              onValueChange={(value) => {
                const newTop10 = [...qualifyingTop10];
                newTop10[index] = value;
                setQualifyingTop10(newTop10);
              }}
              disabled={index === 0 || disabled}
            >
              <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableDrivers(index).map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
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
};
