
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Race } from "@/types/betting";
import { Database } from "@/integrations/supabase/types";

type RacePointData = {
  id: string;
  user_id: string;
  race_id: string;
  qualifying_points: number;
  race_points: number;
  pole_time_points: number;
  fastest_lap_points: number;
  dnf_points: number;
  total_points: number;
  created_at: string;
  prediction_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

const RacePoints = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();

  // Buscar dados da corrida
  const { data: race } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();
      
      if (error) throw error;
      return data as Race;
    },
  });

  // Buscar pontuações da corrida
  const { data: points } = useQuery({
    queryKey: ["racePoints", raceId],
    queryFn: async (): Promise<RacePointData[]> => {
      if (!raceId) throw new Error("Race ID não fornecido");
      
      const { data, error } = await supabase
        .from("race_points")
        .select(`
          id,
          user_id,
          race_id,
          qualifying_points,
          race_points,
          pole_time_points,
          fastest_lap_points,
          dnf_points,
          total_points,
          created_at,
          prediction_id,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("race_id", raceId)
        .order("total_points", { ascending: false });
      
      if (error) throw error;
      if (!data) return [];

      return data as RacePointData[];
    },
  });

  if (!race || !points) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando pontuações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Pontuações: {race.name}</h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
          >
            Voltar
          </Button>
        </div>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Pontuação Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-racing-silver/20">
                    <th className="px-4 py-2 text-left">Participante</th>
                    <th className="px-4 py-2 text-center">Classificação</th>
                    <th className="px-4 py-2 text-center">Corrida</th>
                    <th className="px-4 py-2 text-center">Pole Time</th>
                    <th className="px-4 py-2 text-center">Volta Rápida</th>
                    <th className="px-4 py-2 text-center">DNFs</th>
                    <th className="px-4 py-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.id} className="border-b border-racing-silver/20">
                      <td className="px-4 py-2 flex items-center gap-2">
                        {point.profiles?.avatar_url && (
                          <img 
                            src={point.profiles.avatar_url} 
                            alt={point.profiles.username} 
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {point.profiles?.username || "Usuário"}
                      </td>
                      <td className="px-4 py-2 text-center">{point.qualifying_points}</td>
                      <td className="px-4 py-2 text-center">{point.race_points}</td>
                      <td className="px-4 py-2 text-center">{point.pole_time_points}</td>
                      <td className="px-4 py-2 text-center">{point.fastest_lap_points}</td>
                      <td className="px-4 py-2 text-center">{point.dnf_points}</td>
                      <td className="px-4 py-2 text-center font-bold">{point.total_points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePoints;
