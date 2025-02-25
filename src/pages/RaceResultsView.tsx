
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Race, Driver, RaceResult, Prediction } from "@/types/betting";
import { calculatePoints } from "@/utils/scoring-utils";

const RaceResultsView = () => {
  const { raceId } = useParams();

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

  // Buscar resultados oficiais
  const { data: raceResult } = useQuery({
    queryKey: ["raceResult", raceId],
    queryFn: async () => {
      if (!raceId) return null;
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();
      
      if (error) throw error;
      return data as RaceResult;
    },
  });

  // Buscar lista de pilotos
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `);
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Buscar todos os palpites desta corrida
  const { data: predictions } = useQuery({
    queryKey: ["predictions", raceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          user:profiles (
            username,
            avatar_url
          )
        `)
        .eq("race_id", raceId);
      
      if (error) throw error;
      return data as (Prediction & { user: { username: string; avatar_url?: string } })[];
    },
  });

  const getDriverName = (driverId: string) => {
    return drivers?.find(d => d.id === driverId)?.name || "Piloto não encontrado";
  };

  if (!race || !raceResult || !drivers || !predictions) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  // Calcular pontuações
  const results = predictions.map(prediction => {
    // Calcular pontos baseados na posição final
    const points = prediction.top_10.reduce((total, driverId, index) => {
      return total + calculatePoints(index + 1);
    }, 0);

    return {
      username: prediction.user.username,
      avatar_url: prediction.user.avatar_url,
      points,
      created_at: prediction.created_at,
    };
  }).sort((a, b) => {
    // Primeiro critério: maior pontuação
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Critério de desempate: aposta mais antiga
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{race.name} - Resultados</h1>

        {/* Resultados Oficiais */}
        <Card className="bg-racing-black border-racing-silver/20 mb-8">
          <CardHeader>
            <CardTitle>Resultados Oficiais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Grid de Largada</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {raceResult.qualifying_results.slice(0, 10).map((driverId, index) => (
                  <div key={`qual-${index}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <span>{getDriverName(driverId)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Resultado da Corrida</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {raceResult.race_results.slice(0, 10).map((driverId, index) => (
                  <div key={`race-${index}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <span>{getDriverName(driverId)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Tempo da Pole</h3>
                <p>{raceResult.pole_time}</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Volta Mais Rápida</h3>
                <p>{getDriverName(raceResult.fastest_lap || "")}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Abandonos ({raceResult.dnf_drivers?.length || 0})</h3>
              <div className="flex flex-wrap gap-2">
                {raceResult.dnf_drivers?.map((driverId) => (
                  <span key={driverId} className="bg-racing-red/10 px-2 py-1 rounded">
                    {getDriverName(driverId)}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ranking */}
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Classificação da Corrida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-racing-silver/20">
                    <th className="px-4 py-2 text-left">Posição</th>
                    <th className="px-4 py-2 text-left">Participante</th>
                    <th className="px-4 py-2 text-center">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.username} className="border-b border-racing-silver/20">
                      <td className="px-4 py-2">{index + 1}º</td>
                      <td className="px-4 py-2">{result.username}</td>
                      <td className="px-4 py-2 text-center font-bold">{result.points}</td>
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

export default RaceResultsView;
