
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Race, Driver, RaceResult, Prediction } from "@/types/betting";
import { toast } from "sonner";

export const useRaceResults = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch race data
  const { data: race } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) return null;
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();

      if (error) throw error;
      return data as Race;
    },
  });

  // Fetch drivers with team information
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers-with-teams"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `)
        .order("number", { ascending: true });

      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Fetch race results
  const { data: raceResult, refetch } = useQuery({
    queryKey: ["race-result", raceId],
    queryFn: async () => {
      if (!raceId) return null;
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as RaceResult || null;
    },
  });

  // Fetch predictions for this race
  const { data: predictions } = useQuery({
    queryKey: ["race-predictions", raceId],
    queryFn: async () => {
      if (!raceId) return [];
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          profiles (
            username
          )
        `)
        .eq("race_id", raceId);

      if (error) throw error;
      return data as (Prediction & { profiles: { username: string } })[];
    },
  });

  // Process points for this race
  const processPoints = async () => {
    if (!raceId) return;
    
    try {
      setCalculatingPoints(true);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/update-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ raceId }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast.error("Erro ao calcular pontos: " + data.error);
      } else {
        toast.success("Pontos calculados com sucesso!");
        refetch();
      }
    } catch (error) {
      console.error("Erro ao calcular pontos:", error);
      toast.error("Erro ao calcular pontos");
    } finally {
      setCalculatingPoints(false);
    }
  };

  return {
    raceId: raceId || "",
    race,
    drivers,
    raceResult,
    predictions,
    isLoadingDrivers,
    calculatingPoints,
    loading,
    setLoading,
    refetch,
    processPoints,
    existingResult: raceResult,
  };
};
