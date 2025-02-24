
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
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

  return {
    race,
    drivers,
    existingResult,
    refetch,
    loading,
    setLoading,
  };
};
