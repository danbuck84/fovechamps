
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserPrediction {
  id: string;
  pole_position: string;
  fastest_lap: string;
  user: {
    full_name: string | null;
    username: string;
  };
}

interface UserPredictionsCardProps {
  raceId: string | null;
  predictions: UserPrediction[];
  isLoading: boolean;
  getDriverName: (driverId: string) => string;
}

export const UserPredictionsCard = ({ 
  raceId, 
  predictions, 
  isLoading, 
  getDriverName 
}: UserPredictionsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-racing-black border-racing-silver/20">
      <CardHeader>
        <CardTitle className="text-xl text-racing-white">
          Apostas dos Usuários
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-racing-silver">Carregando apostas...</p>
        ) : predictions && predictions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-racing-silver/20">
                <TableHead className="text-racing-silver">Usuário</TableHead>
                <TableHead className="text-racing-silver">Pole Position</TableHead>
                <TableHead className="text-racing-silver">Volta Mais Rápida</TableHead>
                <TableHead className="text-racing-silver">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictions.map((prediction) => (
                <TableRow key={prediction.id} className="border-racing-silver/20">
                  <TableCell className="text-racing-white">
                    {prediction.user ? prediction.user.full_name || prediction.user.username : "Usuário"}
                  </TableCell>
                  <TableCell className="text-racing-silver">
                    {prediction.pole_position ? getDriverName(prediction.pole_position) : "N/A"}
                  </TableCell>
                  <TableCell className="text-racing-silver">
                    {prediction.fastest_lap ? getDriverName(prediction.fastest_lap) : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                      onClick={() => navigate(`/race-predictions/${raceId}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-racing-silver">Nenhuma aposta encontrada para esta corrida.</p>
        )}
      </CardContent>
    </Card>
  );
};
