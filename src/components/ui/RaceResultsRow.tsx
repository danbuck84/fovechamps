
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, LineChart } from "lucide-react";

interface RaceResultsRowProps {
  raceId: string;
  hasResults: boolean;
}

export const RaceResultsRow = ({ raceId, hasResults }: RaceResultsRowProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
        onClick={() => navigate(`/race-results/${raceId}`)}
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
    </div>
  );
};
