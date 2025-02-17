
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RacePredictionsHeaderProps {
  onBack: () => void;
}

export const RacePredictionsHeader = ({ onBack }: RacePredictionsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="ghost"
        className="text-racing-silver hover:text-racing-white"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Button
        variant="ghost"
        className="text-racing-silver hover:text-racing-white"
        asChild
      >
        <Link to="/my-predictions">
          Ver Minhas Apostas
        </Link>
      </Button>
    </div>
  );
};
