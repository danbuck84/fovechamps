
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
      className="bg-fove-silver/20 hover:bg-fove-silver/30 text-fove-white"
      disabled={isDeadlinePassed}
    >
      Limpar Aposta
    </Button>
    
    <Button 
      type="submit"
      className="bg-fove-red hover:bg-fove-red/90 text-fove-white disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isDeadlinePassed}
    >
      Salvar Apostas
    </Button>
  </div>
);
