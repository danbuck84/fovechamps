
import { Input } from "@/components/ui/input";
import type { Driver } from "@/types/betting";

interface PolePositionFormProps {
  poleTime: string;
  onPoleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const PolePositionForm = ({
  poleTime,
  onPoleTimeChange,
  disabled = false,
}: PolePositionFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Classificação</h3>
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
  );
};
