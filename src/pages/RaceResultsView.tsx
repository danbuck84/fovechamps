
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Race, Driver, RaceResult } from "@/types/betting";

const RaceResultsView = () => {
  const { raceId } = useParams();

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
        .select("*, team:teams(name, engine)");
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Buscar resultados da corrida
  const { data: raceResult, isLoading: isLoadingResults } = useQuery({
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

  if (isLoadingRace || isLoadingResults) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando resultados...</p>
      </div>
    );
  }

  if (!race || !raceResult || !drivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Nenhum resultado encontrado.</p>
      </div>
    );
  }

  // Função auxiliar para encontrar o nome do piloto
  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Piloto não encontrado';
  };

  return (
    <div className="min-h-screen bg-racing-black text-racing-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resultados Oficiais: {race.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resultados da Classificação */}
          <Card className="bg-racing-black border-racing-silver/20">
            <CardHeader>
              <CardTitle>Resultados da Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-racing-silver mb-4">
                  Tempo da Pole: {raceResult.pole_time || "Não disponível"}
                </p>
                {raceResult.qualifying_results.map((driverId, index) => (
                  <div key={`qual-${driverId}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <span>{getDriverName(driverId)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resultados da Corrida */}
          <Card className="bg-racing-black border-racing-silver/20">
            <CardHeader>
              <CardTitle>Resultados da Corrida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-racing-silver mb-4">
                  Volta mais rápida: {getDriverName(raceResult.fastest_lap || "")}
                </p>
                {raceResult.race_results.map((driverId, index) => (
                  <div key={`race-${driverId}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <span>{getDriverName(driverId)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* DNFs */}
          {raceResult.dnf_drivers && raceResult.dnf_drivers.length > 0 && (
            <Card className="bg-racing-black border-racing-silver/20">
              <CardHeader>
                <CardTitle>Abandonos (DNF)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {raceResult.dnf_drivers.map((driverId) => (
                    <div key={`dnf-${driverId}`}>
                      {getDriverName(driverId)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceResultsView;

