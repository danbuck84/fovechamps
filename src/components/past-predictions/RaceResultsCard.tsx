
import { useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RaceResultsCardProps {
  raceId: string | null;
  raceResult: any;
  isLoading: boolean;
  getDriverName: (driverId: string) => string;
}

export const RaceResultsCard = ({ 
  raceId, 
  raceResult, 
  isLoading, 
  getDriverName 
}: RaceResultsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-racing-black border-racing-silver/20 mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-racing-white">
          Resultados Oficiais
        </CardTitle>
        <Button
          variant="outline"
          onClick={() => navigate(`/race-results-view/${raceId}`)}
          className="bg-racing-black text-racing-white border-racing-red hover:bg-racing-red/10"
        >
          <Trophy className="w-4 h-4 mr-2" />
          Ver Detalhes
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-racing-silver">Carregando resultados...</p>
        ) : raceResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-racing-red font-semibold mb-2">Pódio</h3>
              {raceResult.race_results && raceResult.race_results.slice(0, 3).map((driverId: string, index: number) => (
                <p key={`podium-${driverId}`} className="text-racing-white">
                  {index + 1}. {getDriverName(driverId)}
                </p>
              ))}
            </div>
            <div>
              <h3 className="text-racing-red font-semibold mb-2">Pole Position</h3>
              <p className="text-racing-white">
                {raceResult.qualifying_results && raceResult.qualifying_results.length > 0 ? 
                  getDriverName(raceResult.qualifying_results[0]) : 
                  "Não disponível"}
              </p>
              <h3 className="text-racing-red font-semibold mt-2 mb-2">Volta Mais Rápida</h3>
              <p className="text-racing-white">
                {raceResult.fastest_lap ? 
                  getDriverName(raceResult.fastest_lap) : 
                  "Não disponível"}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-racing-silver">Nenhum resultado disponível para esta corrida.</p>
        )}
      </CardContent>
    </Card>
  );
};
