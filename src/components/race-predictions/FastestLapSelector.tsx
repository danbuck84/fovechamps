
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
      <h3 className="text-xl font-semibold text-racing-white">Volta Mais Rápida</h3>
      <p className="text-racing-silver">Quem fará a volta mais rápida da corrida?</p>

      <div className="flex flex-wrap gap-4 mt-4">
        <Select
          disabled={disabled}
          value={fastestLap || undefined}
          onValueChange={(value) => setFastestLap(value)}
        >
          <SelectTrigger 
            ref={buttonRef}
            className="w-[300px] bg-racing-black text-racing-white border-racing-silver/20"
          >
            <SelectValue placeholder="Selecione o piloto" />
          </SelectTrigger>
          <SelectContent className="bg-racing-black border-racing-silver/20">
            {drivers.map((driver) => (
              <SelectItem 
                key={driver.id} 
                value={driver.id}
                className="text-racing-white hover:bg-racing-silver/10 focus:bg-racing-silver/10 focus:text-racing-white"
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
