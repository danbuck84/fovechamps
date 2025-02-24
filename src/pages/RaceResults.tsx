
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import type { Race, Driver, Prediction, RaceResult } from "@/types/betting";
import ComparisonTable from "@/components/race-results/ComparisonTable";

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
      return data as (Prediction & { profiles: { username: string } })[];
    },
  });

  if (!race || !drivers || !raceResult || !predictions) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  const getDriverName = (driverId: string) => {
    if (!driverId) return "Piloto não selecionado";
    const driver = drivers.find(d => d.id === driverId);
    if (!driver) {
      console.error(`Driver not found for ID: ${driverId}`);
      return "Piloto não encontrado";
    }
    return `${driver.name} (${driver.team.name})`;
  };

  const handleBack = () => {
    navigate("/all-race-results");
  };

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Resultados: {race.name}</h1>
          <Button 
            variant="outline"
            onClick={handleBack}
            className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
          >
            Voltar
          </Button>
        </div>

        {/* Resultados Oficiais */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-racing-white">Resultados Oficiais</h2>
          <div className="bg-racing-black border border-racing-silver/20 rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-racing-silver mb-2">Pole Position</h3>
                <div className="p-2 bg-racing-silver/10 rounded">
                  <span className="text-racing-white">{getDriverName(raceResult.qualifying_results[0])}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-racing-silver mb-2">Tempo da Pole</h3>
                <div className="p-2 bg-racing-silver/10 rounded">
                  <span className="text-racing-white">{raceResult.pole_time}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Classificação</h3>
              <div className="space-y-2">
                {raceResult.qualifying_results.slice(0, 10).map((driverId, index) => (
                  <div key={`qual-${driverId}`} className="p-2 bg-racing-silver/10 rounded">
                    <span className="text-racing-white">
                      {index + 1}. {getDriverName(driverId)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-racing-silver mb-2">TOP 10 - Corrida</h3>
              <div className="space-y-2">
                {raceResult.race_results.slice(0, 10).map((driverId, index) => (
                  <div key={`race-${driverId}`} className="p-2 bg-racing-silver/10 rounded">
                    <span className="text-racing-white">
                      {index + 1}. {getDriverName(driverId)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-racing-silver mb-2">Volta Mais Rápida</h3>
                <div className="p-2 bg-racing-silver/10 rounded">
                  <span className="text-racing-white">{getDriverName(raceResult.fastest_lap)}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-racing-silver mb-2">DNFs</h3>
                <div className="p-2 bg-racing-silver/10 rounded">
                  <span className="text-racing-white">
                    {raceResult.dnf_drivers?.length || 0} DNFs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Apostas dos Usuários */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-racing-white">Apostas dos Participantes</h2>
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
    </div>
  );
};

export default RaceResults;
