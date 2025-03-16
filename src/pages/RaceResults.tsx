
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { calculateAllPoints } from "@/utils/scoring-utils";
import ComparisonTable from "@/components/race-results/ComparisonTable";
import { isDeadlinePassed } from "@/utils/date-utils";
import type { Race, Driver, Prediction, RaceResult } from "@/types/betting";

const RaceResults = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [calculatingPoints, setCalculatingPoints] = useState(false);

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

  // Buscar lista de pilotos com todos os campos necessários
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data: driversData, error } = await supabase
        .from("drivers")
        .select(`
          id,
          name,
          number,
          team_id,
          team:teams (
            id,
            name
          )
        `);
      
      if (error) {
        console.error("Erro ao carregar pilotos:", error);
        throw error;
      }

      console.log("Drivers loaded successfully:", driversData);
      return driversData as (Driver & { team: { name: string } })[];
    },
  });

  // Buscar resultados oficiais
  const { data: raceResult, refetch: refetchResults } = useQuery({
    queryKey: ["raceResult", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();
      
      if (error) throw error;
      console.log("Race results loaded:", data);
      return data as RaceResult;
    },
  });

  // Check if deadline has passed
  const deadlinePassed = race ? isDeadlinePassed(race.qualifying_date) : false;

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

  const processPoints = async () => {
    if (!raceId) {
      toast.error("ID da corrida não fornecido");
      return;
    }
    
    setCalculatingPoints(true);
    try {
      await calculateAllPoints(raceId);
      toast.success("Pontos calculados com sucesso!");
      // Recarregar os dados após calcular os pontos
      await refetchResults();
    } catch (error) {
      console.error("Erro ao calcular pontos:", error);
      toast.error("Erro ao calcular pontos");
    } finally {
      setCalculatingPoints(false);
    }
  };

  if (!race || !drivers || !raceResult || !predictions || isLoadingDrivers) {
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

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Resultados: {race?.name}</h1>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/all-race-results")}
              className="bg-racing-silver/20 hover:bg-racing-silver/30 text-racing-white border-none transition-colors duration-200 font-medium px-6 py-2 rounded-md shadow-lg hover:shadow-racing-silver/20"
            >
              Voltar
            </Button>
            <Button 
              variant="default"
              onClick={processPoints}
              disabled={calculatingPoints}
              className="bg-racing-red hover:bg-racing-red/80 text-racing-white border-none transition-colors duration-200 font-medium px-6 py-2 rounded-md shadow-lg hover:shadow-racing-red/20"
            >
              {calculatingPoints ? "Calculando..." : "Calcular Pontos"}
            </Button>
          </div>
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

        {/* Apostas dos Usuários - Só mostrar se o prazo encerrou */}
        {deadlinePassed ? (
          <div>
            <h2 className="text-xl font-bold mb-4 text-racing-white">Apostas dos Participantes</h2>
            <div className="grid gap-6 md:grid-cols-2 overflow-x-auto">
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
        ) : (
          <div className="bg-racing-black border border-racing-silver/20 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-4 text-racing-white">Apostas dos Participantes</h2>
            <p className="text-racing-silver">As apostas serão exibidas após o encerramento do prazo (classificação).</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaceResults;
