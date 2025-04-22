
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface FastestLapSelectorProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  fastestLap: string;
  setFastestLap: (value: string) => void;
  disabled?: boolean;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export const FastestLapSelector = ({
  drivers,
  fastestLap,
  setFastestLap,
  disabled = false,
  buttonRef,
}: FastestLapSelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-fove-white">Volta Mais Rápida</h3>
      <p className="text-fove-silver">Quem fará a volta mais rápida da corrida?</p>

      <div className="flex flex-wrap gap-4 mt-4">
        <Select
          disabled={disabled}
          value={fastestLap || undefined}
          onValueChange={(value) => setFastestLap(value)}
        >
          <SelectTrigger 
            ref={buttonRef}
            className="w-[300px] bg-fove-navy text-fove-white border-fove-silver/20 min-h-[44px]"
          >
            <SelectValue placeholder="Selecione o piloto" />
          </SelectTrigger>
          <SelectContent 
            className="bg-fove-navy border-fove-silver/20"
            position="popper"
            sideOffset={5}
            align="start"
            avoidCollisions={true}
          >
            {drivers.map((driver) => (
              <SelectItem 
                key={driver.id} 
                value={driver.id}
                className="text-fove-white hover:bg-fove-silver/10 focus:bg-fove-silver/10 focus:text-fove-white py-3"
              >
                {driver.name} ({driver.team.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
