
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RaceInfoHeader } from "./RaceInfoHeader";
import { RacePredictionsHeader } from "./RacePredictionsHeader";
import type { Race } from "@/types/betting";

interface DeadlinePassedViewProps {
  race: Race;
  isDeadlinePassed: boolean;
  onBack: () => void;
  onViewPredictions: () => void;
  onEditResults: () => void;
  isAdmin: boolean;
}

export const DeadlinePassedView = ({
  race,
  isDeadlinePassed,
  onBack,
  onViewPredictions,
  onEditResults,
  isAdmin,
}: DeadlinePassedViewProps) => {
  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <RacePredictionsHeader onBack={onBack} />
        <Card className="bg-racing-black border-racing-silver/20">
          <RaceInfoHeader 
            race={race}
            isDeadlinePassed={isDeadlinePassed}
          />
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-racing-silver mb-4">
              O prazo para fazer palpites para este Grande Prêmio já encerrou.
            </p>
            <Button
              variant="outline"
              onClick={onViewPredictions}
              className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-silver/20 mb-4"
            >
              Ver Meus Palpites
            </Button>
            {isAdmin && (
              <Button
                onClick={onEditResults}
                className="bg-racing-red hover:bg-racing-red/90"
              >
                Editar Resultados
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
