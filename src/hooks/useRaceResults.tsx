
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState } from "react";
import { calculateAllPoints } from "@/utils/scoring-utils";
import type { Race, Driver, Prediction, RaceResult } from "@/types/betting";

export const useRaceResults = () => {
  const { raceId } = useParams();
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
            name,
            engine
          )
        `);
      
      if (error) {
        console.error("Erro ao carregar pilotos:", error);
        throw error;
      }

      return driversData as (Driver & { team: { name: string; engine: string } })[];
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

  return {
    raceId,
    race,
    drivers,
    raceResult,
    predictions,
    isLoadingDrivers,
    calculatingPoints,
    processPoints,
  };
};
