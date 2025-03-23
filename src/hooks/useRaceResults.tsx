
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

  console.log("useRaceResults: Initialized with raceId:", raceId);

  // Fetch race data
  const { data: race } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      console.log("useRaceResults: Fetching race data for raceId:", raceId);
      if (!raceId) {
        console.log("useRaceResults: No raceId provided");
        return null;
      }
      
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();

      if (error) {
        console.error("useRaceResults: Error fetching race:", error);
        throw error;
      }
      
      console.log("useRaceResults: Race data fetched:", data);
      return data as Race;
    },
    retry: 1,
    enabled: !!raceId,
  });

  // Fetch drivers with team information
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers-with-teams"],
    queryFn: async () => {
      console.log("useRaceResults: Fetching drivers with teams");
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

      if (error) {
        console.error("useRaceResults: Error fetching drivers:", error);
        throw error;
      }
      
      console.log("useRaceResults: Drivers fetched:", data?.length || 0);
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
    retry: 1,
  });

  // Fetch race results
  const { data: raceResult, refetch } = useQuery({
    queryKey: ["race-result", raceId],
    queryFn: async () => {
      console.log("useRaceResults: Fetching race results for raceId:", raceId);
      if (!raceId) return null;
      
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors when no result is found

      if (error && error.code !== "PGRST116") {
        console.error("useRaceResults: Error fetching race results:", error);
        throw error;
      }
      
      console.log("useRaceResults: Race results fetched:", data ? "Found" : "Not found");
      return data as RaceResult || null;
    },
    retry: 1,
    enabled: !!raceId,
  });

  // Fetch predictions for this race
  const { data: predictions } = useQuery({
    queryKey: ["race-predictions", raceId],
    queryFn: async () => {
      console.log("useRaceResults: Fetching predictions for raceId:", raceId);
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

      if (error) {
        console.error("useRaceResults: Error fetching predictions:", error);
        throw error;
      }
      
      console.log("useRaceResults: Predictions fetched:", data?.length || 0);
      return data as (Prediction & { profiles: { username: string } })[];
    },
    retry: 1,
    enabled: !!raceId,
  });

  // Process points for this race
  const processPoints = async () => {
    if (!raceId) {
      console.log("useRaceResults: Cannot process points - no raceId");
      return;
    }
    
    console.log("useRaceResults: Processing points for raceId:", raceId);
    
    try {
      setCalculatingPoints(true);
      
      // Debug log for the URL 
      const functionUrl = `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'https://qrhuynyipwcgrdligbhq.supabase.co/functions/v1'}/update-points`;
      console.log("useRaceResults: Calling function URL:", functionUrl);
      
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaHV5bnlpcHdjZ3JkbGlnYmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDIyOTYsImV4cCI6MjA1NDg3ODI5Nn0.N973A98oFmZkC4t2oULlVj9bv7hUuIjR6O7zN_ojgZM'}`,
        },
        body: JSON.stringify({ raceId }),
      });
      
      if (!response.ok) {
        console.error("useRaceResults: Function response not OK", response.status, response.statusText);
        const text = await response.text();
        console.error("useRaceResults: Error response:", text);
        toast.error(`Erro ao calcular pontos: ${response.status} ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      console.log("useRaceResults: Function response:", data);
      
      if (data.error) {
        console.error("useRaceResults: Function returned error:", data.error);
        toast.error("Erro ao calcular pontos: " + data.error);
      } else {
        console.log("useRaceResults: Points calculated successfully");
        toast.success("Pontos calculados com sucesso!");
        refetch();
      }
    } catch (error) {
      console.error("useRaceResults: Error calculating points:", error);
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
