
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";

interface RaceHeaderProps {
  raceName: string | undefined;
  onBack: () => void;
  onCalculatePoints: () => void;
  isCalculating: boolean;
}

export const RaceHeader = ({
  raceName,
  onBack,
  onCalculatePoints,
  isCalculating,
}: RaceHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">{raceName} - Resultados</h1>
      </div>
      <Button 
        variant="default"
        onClick={onCalculatePoints}
        disabled={isCalculating}
        className="bg-racing-red hover:bg-racing-red/80"
      >
        <Calculator className="h-4 w-4 mr-2" />
        {isCalculating ? "Calculando..." : "Calcular Pontos"}
      </Button>
    </div>
  );
};
