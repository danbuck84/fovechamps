
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface DNFPredictionFormProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  dnfPredictions: string[];
  onDriverDNF: (driverId: string) => void;
  disabled?: boolean;
}

export const DNFPredictionForm = ({
  drivers,
  dnfPredictions,
  onDriverDNF,
  disabled = false,
}: DNFPredictionFormProps) => {
  const [selectedCount, setSelectedCount] = useState<string>(dnfPredictions.length.toString());

  const handleCountChange = (value: string) => {
    setSelectedCount(value);
    // Limita a lista de DNFs ao novo número selecionado
    if (parseInt(value) < dnfPredictions.length) {
      dnfPredictions.slice(0, parseInt(value)).forEach(id => onDriverDNF(id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-racing-white">Sobreviventes</h3>
        <p className="text-sm text-racing-silver">
          Quantos pilotos você acha que não terminarão a corrida?
        </p>
      </div>
      
      <Select
        value={selectedCount}
        onValueChange={handleCountChange}
        disabled={disabled}
      >
        <SelectTrigger className="bg-racing-white text-racing-black border-racing-silver/20">
          <SelectValue placeholder="Selecione um número" />
        </SelectTrigger>
        <SelectContent className="bg-racing-white border-racing-silver/20">
          {Array.from({ length: 11 }, (_, i) => (
            <SelectItem 
              key={i} 
              value={i.toString()}
              className="hover:bg-racing-black hover:text-racing-white focus:bg-racing-black focus:text-racing-white cursor-pointer"
            >
              {i} piloto{i !== 1 ? 's' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {parseInt(selectedCount) > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {Array.from({ length: parseInt(selectedCount) }).map((_, index) => (
            <Select
              key={`dnf-${index}`}
              value={dnfPredictions[index] || ""}
              onValueChange={(value) => onDriverDNF(value)}
              disabled={disabled}
            >
              <SelectTrigger className="bg-racing-white text-racing-black border-racing-silver/20">
                <SelectValue placeholder={`${index + 1}º DNF`} />
              </SelectTrigger>
              <SelectContent className="bg-racing-white border-racing-silver/20">
                {drivers
                  .filter(driver => !dnfPredictions.includes(driver.id) || dnfPredictions[index] === driver.id)
                  .map((driver) => (
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
          ))}
        </div>
      )}
    </div>
  );
};
