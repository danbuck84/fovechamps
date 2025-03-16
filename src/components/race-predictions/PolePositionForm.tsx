
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface PolePositionFormProps {
  poleTime: string;
  onPoleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const PolePositionForm = forwardRef<HTMLDivElement, PolePositionFormProps>(({
  poleTime,
  onPoleTimeChange,
  disabled = false,
  inputRef,
}, ref) => {
  return (
    <div ref={ref} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-racing-white">Tempo da Pole</h3>
        <p className="text-sm text-racing-silver">
          Digite apenas números, ex: 123456 para 1:23.456
        </p>
      </div>
      <Input
        id="poleTime"
        value={poleTime}
        onChange={onPoleTimeChange}
        className={`bg-racing-black border-racing-silver/20 text-racing-white placeholder:text-racing-silver/50 ${!poleTime ? "border-racing-red" : ""}`}
        placeholder="Digite apenas números"
        required
        disabled={disabled}
        ref={inputRef}
      />
    </div>
  );
});

PolePositionForm.displayName = "PolePositionForm";
