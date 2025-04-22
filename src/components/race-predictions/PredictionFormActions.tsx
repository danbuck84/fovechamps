
import { Button } from "@/components/ui/button";

interface PredictionFormActionsProps {
  isDeadlinePassed: boolean;
  handleClearPredictions: () => void;
}

export const PredictionFormActions = ({
  isDeadlinePassed,
  handleClearPredictions
}: PredictionFormActionsProps) => (
  <div className="flex flex-wrap gap-4 justify-between">
    <Button 
      type="button"
      onClick={handleClearPredictions}
      className="bg-racing-silver/20 hover:bg-racing-silver/30 text-racing-white"
      disabled={isDeadlinePassed}
    >
      Limpar Aposta
    </Button>
    
    <Button 
      type="submit"
      className="bg-racing-red hover:bg-racing-red/90 text-racing-white disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDeadlinePassed}
    >
      Salvar Apostas
    </Button>
  </div>
);
