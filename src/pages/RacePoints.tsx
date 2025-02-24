
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Race } from "@/types/betting";
import type { Database } from "@/integrations/supabase/types";

type RacePointRow = Database["public"]["Tables"]["race_points"]["Row"] & {
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
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      
      const { data, error } = await supabase
        .from("race_points")
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq("race_id", raceId)
        .order("total_points", { ascending: false });
      
      if (error) throw error;
      return data as RacePointRow[];
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
            <CardTitle className="text-racing-white">Pontuação Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-racing-silver/20">
                    <th className="px-4 py-2 text-left text-racing-silver">Participante</th>
                    <th className="px-4 py-2 text-center text-racing-silver">Classificação</th>
                    <th className="px-4 py-2 text-center text-racing-silver">Corrida</th>
                    <th className="px-4 py-2 text-center text-racing-silver">Pole Time</th>
                    <th className="px-4 py-2 text-center text-racing-silver">Volta Rápida</th>
                    <th className="px-4 py-2 text-center text-racing-silver">DNFs</th>
                    <th className="px-4 py-2 text-center text-racing-silver">Total</th>
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
                        <span className="text-racing-white">{point.profiles?.username || "Usuário"}</span>
                      </td>
                      <td className="px-4 py-2 text-center text-racing-white">{point.qualifying_points || 0}</td>
                      <td className="px-4 py-2 text-center text-racing-white">{point.race_points || 0}</td>
                      <td className="px-4 py-2 text-center text-racing-white">{point.pole_time_points || 0}</td>
                      <td className="px-4 py-2 text-center text-racing-white">{point.fastest_lap_points || 0}</td>
                      <td className="px-4 py-2 text-center text-racing-white">{point.dnf_points || 0}</td>
                      <td className="px-4 py-2 text-center font-bold text-racing-white">{point.total_points || 0}</td>
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
