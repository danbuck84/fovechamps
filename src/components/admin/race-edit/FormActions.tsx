
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSave: () => Promise<void>;
}

export const FormActions = ({
  isSubmitting,
  onCancel,
  onSave
}: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSave}
        disabled={isSubmitting}
        className="bg-racing-red hover:bg-racing-red/80 text-racing-white"
      >
        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
  );
};
