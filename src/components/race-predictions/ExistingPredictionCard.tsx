
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RaceInfoHeader } from "./RaceInfoHeader";
import type { Race } from "@/types/betting";

interface ExistingPredictionCardProps {
  race: Race;
  isDeadlinePassed: boolean;
  onEdit: () => void;
  onViewPredictions: () => void;
}

export const ExistingPredictionCard = ({
  race,
  isDeadlinePassed,
  onEdit,
  onViewPredictions,
}: ExistingPredictionCardProps) => {
  return (
    <Card className="bg-fove-navy border-fove-silver/20">
      <RaceInfoHeader 
        race={race}
        isDeadlinePassed={isDeadlinePassed}
      />
      <CardContent className="flex flex-col items-center justify-center py-8">
        <p className="text-fove-silver mb-4">
          Você já fez seus palpites para este Grande Prêmio.
        </p>
        <div className="space-x-4">
          <Button
            variant="outline"
            onClick={onViewPredictions}
            className="bg-fove-navy text-fove-white border-fove-silver/20 hover:bg-fove-silver/20"
          >
            Ver Meus Palpites
          </Button>
          <Button
            onClick={onEdit}
            className="bg-fove-red hover:bg-fove-red/90"
          >
            Editar Palpites
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
