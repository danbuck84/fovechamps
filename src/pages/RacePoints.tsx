
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import MainLayout from "@/components/layout/MainLayout";
import type { Race } from "@/types/betting";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type RacePoint = Database["public"]["Tables"]["race_points"]["Row"];

interface RacePointWithProfile extends RacePoint {
  profiles: Pick<Profile, "username" | "avatar_url">;
}

const RacePoints = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();

  // Buscar dados da corrida
  const { data: race, isLoading: isLoadingRace } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();
      
      if (error) {
        console.error("Erro ao buscar corrida:", error);
        throw error;
      }
      return data as Race;
    },
  });

  // Buscar pontuações da corrida
  const { data: points, isLoading: isLoadingPoints } = useQuery({
    queryKey: ["racePoints", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      
      const { data, error } = await supabase
        .from("race_points")
        .select(`
          *,
          profiles!race_points_user_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("race_id", raceId)
        .order("total_points", { ascending: false });
      
      if (error) {
        console.error("Erro ao buscar pontuações:", error);
        throw error;
      }
      
      console.log("Pontuações carregadas:", data);
      
      // Transformar os dados para garantir a tipagem correta
      const formattedData = data.map(point => ({
        ...point,
        profiles: point.profiles || {
          username: "Usuário Desconhecido",
          avatar_url: null
        }
      }));

      return formattedData as RacePointWithProfile[];
    },
  });

  if (isLoadingRace || isLoadingPoints) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <p className="text-racing-silver">Carregando pontuações...</p>
        </div>
      </MainLayout>
    );
  }

  if (!race || !points) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <p className="text-racing-silver">Nenhuma pontuação encontrada.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black text-racing-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Pontuações: {race?.name}</h1>
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="bg-racing-red hover:bg-racing-red/80 text-racing-white border-none"
            >
              Voltar
            </Button>
          </div>

          <Card className="bg-racing-black border-racing-silver/20 w-full">
            <CardHeader className="px-6">
              <CardTitle className="text-racing-white">Pontuação Detalhada</CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-racing-silver/20">
                      <TableHead className="text-left text-racing-silver font-semibold">Participante</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Classificação</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Corrida</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Pole Time</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Volta Rápida</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Sobreviventes</TableHead>
                      <TableHead className="text-center text-racing-silver font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {points.map((point) => (
                      <TableRow key={point.id} className="border-b border-racing-silver/20">
                        <TableCell className="flex items-center gap-2">
                          {point.profiles.avatar_url && (
                            <img 
                              src={point.profiles.avatar_url} 
                              alt={point.profiles.username}
                              className="w-6 h-6 rounded-full"
                            />
                          )}
                          <span className="text-racing-white">{point.profiles.username}</span>
                        </TableCell>
                        <TableCell className="text-center text-racing-white">{point.qualifying_points || 0}</TableCell>
                        <TableCell className="text-center text-racing-white">{point.race_points || 0}</TableCell>
                        <TableCell className="text-center text-racing-white">{point.pole_time_points || 0}</TableCell>
                        <TableCell className="text-center text-racing-white">{point.fastest_lap_points || 0}</TableCell>
                        <TableCell className="text-center text-racing-white">{point.dnf_points || 0}</TableCell>
                        <TableCell className="text-center font-bold text-racing-white">{point.total_points || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default RacePoints;
