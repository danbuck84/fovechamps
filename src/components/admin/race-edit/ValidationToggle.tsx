
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ValidationToggleProps {
  isValid: boolean;
  onValidChange: (isValid: boolean) => void;
}

export const ValidationToggle = ({
  isValid,
  onValidChange
}: ValidationToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="is-valid" 
        checked={isValid} 
        onCheckedChange={onValidChange}
        className="data-[state=checked]:bg-racing-red"
      />
      <Label htmlFor="is-valid" className="text-racing-white">
        É válida para o campeonato?
      </Label>
    </div>
  );
};
