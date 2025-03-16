
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AdminActionButtonsProps {
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export const AdminActionButtons = ({
  onSave,
  isLoading
}: AdminActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
      >
        Voltar
      </Button>
      <Button 
        disabled={isLoading}
        onClick={onSave}
        className="bg-racing-red hover:bg-racing-red/80 text-racing-white"
      >
        {isLoading ? "Processando..." : "Salvar Resultados"}
      </Button>
    </div>
  );
};
