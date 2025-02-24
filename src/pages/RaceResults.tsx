
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import ComparisonTable from "@/components/race-results/ComparisonTable";
import type { Race, Driver, Prediction, RaceResult, Profile } from "@/types/betting";

const RaceResults = () => {
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

  // Buscar lista de pilotos
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(name)");
      
      if (error) throw error;
      return data as (Driver & { team: { name: string } })[];
    },
  });

  // Buscar resultados oficiais
  const { data: raceResult } = useQuery({
    queryKey: ["raceResult", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();
      
      if (error) throw error;
      return data as RaceResult;
    },
  });

  // Buscar todas as apostas para esta corrida
  const { data: predictions } = useQuery({
    queryKey: ["predictions", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          profiles:user_id (
            username
          )
        `)
        .eq("race_id", raceId);
      
      if (error) throw error;
      return data as (Prediction & { profiles: Pick<Profile, "username"> })[];
    },
  });

  if (!race || !drivers || !raceResult || !predictions) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Resultados: {race.name}</h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
          >
            Voltar
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {predictions.map((prediction) => (
            <ComparisonTable
              key={prediction.id}
              prediction={prediction}
              raceResult={raceResult}
              drivers={drivers}
              username={prediction.profiles.username}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceResults;
