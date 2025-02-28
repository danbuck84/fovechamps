
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { calculateDriverPoints, calculateConstructorPoints, calculateAllPoints } from "@/utils/scoring-utils";
import type { Race, Driver, RaceResult } from "@/types/betting";

export const useRaceResults = (raceId: string | undefined) => {
  const [loading, setLoading] = useState(false);

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
        .select("*, team:teams(name, engine)");
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Buscar resultados existentes
  const { data: existingResult, refetch } = useQuery({
    queryKey: ["raceResult", raceId],
    queryFn: async () => {
      if (!raceId) return null;
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .maybeSingle();
      
      if (error) throw error;
      return data as RaceResult | null;
    },
  });

  // Função para processar os pontos
  const processPoints = async () => {
    if (!raceId) {
      console.error("ID da corrida não fornecido");
      return;
    }
    
    setLoading(true);
    try {
      console.log(`Processando pontos para corrida ${raceId}`);
      await calculateAllPoints(raceId);
      console.log("Pontos processados com sucesso!");
    } catch (error) {
      console.error("Erro ao processar pontos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    race,
    drivers,
    existingResult,
    refetch,
    loading,
    setLoading,
    processPoints,
  };
};
