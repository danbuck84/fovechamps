
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";
import { forwardRef } from "react";

interface FastestLapSelectorProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  fastestLap: string;
  setFastestLap: (value: string) => void;
  disabled: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const FastestLapSelector = forwardRef<HTMLDivElement, FastestLapSelectorProps>(({ 
  drivers, 
  fastestLap, 
  setFastestLap, 
  disabled,
  buttonRef
}, ref) => {
  return (
    <div ref={ref} className="space-y-2">
      <h3 className="text-xl font-semibold text-racing-white">Volta Mais Rápida</h3>
      <p className="text-sm text-racing-silver mb-4">
        Selecione o piloto que você acha que fará a volta mais rápida da corrida.
      </p>
      <Select
        value={fastestLap || ""}
        onValueChange={setFastestLap}
        disabled={disabled}
      >
        <SelectTrigger 
          ref={buttonRef} 
          className={`w-full bg-racing-black text-racing-white border-racing-silver/20 ${!fastestLap ? "border-racing-red" : ""}`}
        >
          <SelectValue placeholder="Selecione um piloto" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black border-racing-silver/20">
          <SelectItem value="" className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer">
            Selecione um piloto
          </SelectItem>
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
});

FastestLapSelector.displayName = "FastestLapSelector";
