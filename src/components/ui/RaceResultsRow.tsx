
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, LineChart, Edit } from "lucide-react";

interface RaceResultsRowProps {
  raceId: string;
  hasResults: boolean;
  raceName?: string;
}

export const RaceResultsRow = ({ raceId, hasResults, raceName }: RaceResultsRowProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
        onClick={() => navigate(`/race/${raceId}`)}
        disabled={!hasResults}
      >
        <Trophy className="w-4 h-4 mr-2" />
        Ver Resultados
      </Button>
      <Button
        variant="outline"
        className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
        onClick={() => navigate(`/race-points/${raceId}`)}
        disabled={!hasResults}
      >
        <LineChart className="w-4 h-4 mr-2" />
        Ver Pontuação
      </Button>
      <Button
        variant="outline"
        className="border-racing-red text-racing-red hover:bg-racing-red/10"
        onClick={() => navigate(`/race-predictions/${raceId}`)}
      >
        <Edit className="w-4 h-4 mr-2" />
        {hasResults ? "Ver Aposta" : "Apostar"}
      </Button>
    </div>
  );
};
