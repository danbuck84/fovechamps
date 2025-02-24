
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface FastestLapSelectorProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  fastestLap: string;
  setFastestLap: (value: string) => void;
  disabled: boolean;
}

export const FastestLapSelector = ({ 
  drivers, 
  fastestLap, 
  setFastestLap, 
  disabled 
}: FastestLapSelectorProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-racing-white">Volta Mais Rápida</h3>
      <p className="text-sm text-racing-silver mb-4">
        Selecione o piloto que você acha que fará a volta mais rápida da corrida.
      </p>
      <Select
        value={fastestLap}
        onValueChange={setFastestLap}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
          <SelectValue placeholder="Selecione um piloto" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black border-racing-silver/20">
          {drivers.map((driver) => (
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
  );
};
