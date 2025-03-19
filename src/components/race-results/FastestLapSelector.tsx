
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface FastestLapSelectorProps {
  fastestLap: string;
  onFastestLapChange: (value: string) => void;
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
}

export const FastestLapSelector = ({
  fastestLap,
  onFastestLapChange,
  allDrivers,
}: FastestLapSelectorProps) => {
  const sortDrivers = (drivers: (Driver & { team: { name: string; engine: string } })[]) => {
    return [...drivers].sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-racing-silver mb-2">
        Volta Mais Rápida
      </label>
      <Select
        value={fastestLap || "placeholder"}
        onValueChange={onFastestLapChange}
      >
        <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
          <SelectValue placeholder="Selecione um piloto" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black border-racing-silver/20">
          <SelectItem value="placeholder" className="text-racing-white">
            Selecione um piloto
          </SelectItem>
          {sortDrivers(allDrivers).map((driver) => (
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
