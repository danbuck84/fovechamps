
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface RacePositionsSelectorProps {
  raceResults: string[];
  onRaceDriverChange: (position: number, driverId: string) => void;
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
}

export const RacePositionsSelector = ({
  raceResults,
  onRaceDriverChange,
  allDrivers,
}: RacePositionsSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-racing-silver">
        Grid de Chegada
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={`race-${index}`} className="flex items-center gap-2">
            <span className="w-8 text-racing-silver">{index + 1}.</span>
            <Select
              value={raceResults[index] || "placeholder"}
              onValueChange={(value) => onRaceDriverChange(index, value)}
            >
              <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
                <SelectValue placeholder="Selecione um piloto" />
              </SelectTrigger>
              <SelectContent className="bg-racing-black border-racing-silver/20 max-h-[300px]">
                <SelectItem value="placeholder" className="text-racing-white">
                  Selecione um piloto
                </SelectItem>
                {allDrivers.map((driver) => (
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
};
