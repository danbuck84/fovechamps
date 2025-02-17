
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface PolePositionFormProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  polePosition: string;
  setPolePosition: (value: string) => void;
  poleTime: string;
  onPoleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const PolePositionForm = ({
  drivers,
  polePosition,
  setPolePosition,
  poleTime,
  onPoleTimeChange,
  disabled = false,
}: PolePositionFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Classificação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-racing-silver">
            Pole Position
          </label>
          <Select value={polePosition} onValueChange={setPolePosition} disabled={disabled}>
            <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
              <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map((driver) => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.name} ({driver.team.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="poleTime" className="text-sm text-racing-silver">
            Tempo da Pole (digite apenas números, ex: 123456 para 1:23.456)
          </label>
          <Input
            id="poleTime"
            value={poleTime}
            onChange={onPoleTimeChange}
            className="bg-racing-black border-racing-silver/20 text-racing-white placeholder:text-racing-silver/50"
            placeholder="Digite apenas números"
            required
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
