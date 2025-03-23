
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RaceResultsView } from "@/components/race-results/RaceResultsView";
import { ArrowLeft, Calculator } from "lucide-react";

const RaceResults = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [calculatingPoints, setCalculatingPoints] = useState(false);

  // Fetch race data
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

  // Fetch drivers data
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

      return driversData as (Driver & { team: { name: string } })[];
    },
  });

  // Fetch official race results
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
      return data as RaceResult;
    },
  });

  // Check if deadline has passed
  const deadlinePassed = race ? isDeadlinePassed(race.qualifying_date) : false;

  // Fetch all predictions for this race
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

  const dnfDrivers = raceResult.dnf_drivers || [];

  return (
    <div className="bg-racing-black text-racing-white">
      <div className="container p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{race.name} - Resultados</h1>
          </div>
          <Button 
            variant="default"
            onClick={processPoints}
            disabled={calculatingPoints}
            className="bg-racing-red hover:bg-racing-red/80"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {calculatingPoints ? "Calculando..." : "Calcular Pontos"}
          </Button>
        </div>

        {/* Resultados Oficiais */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Resultados Oficiais</h2>
          <RaceResultsView 
            result={raceResult}
            drivers={drivers}
            fastestLap={raceResult.fastest_lap}
            dnfDrivers={dnfDrivers}
          />
        </div>

        {/* Apostas dos Usuários - Só mostrar se o prazo encerrou */}
        {deadlinePassed ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Apostas dos Participantes</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <Card className="bg-racing-black border-racing-silver/20">
            <CardHeader>
              <CardTitle>Apostas dos Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-racing-silver">As apostas serão exibidas após o encerramento do prazo (classificação).</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RaceResults;
