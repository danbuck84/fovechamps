
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useDriversData } from "./race/useDriversData";
import type { Race, RaceResult, Prediction } from "@/types/betting";

// Make this interface fully align with RaceResult type for consistency
interface RaceResultsResponse {
  id: string;
  race_id: string;
  created_at: string;
  fastest_lap: string | null;
  dnf_drivers: string[] | null;
  qualifying_results: string[];
  race_results: string[];
  pole_time: string; // Required to match RaceResult
}

export function useRaceResults(raceId?: string) {
  const [calculatingPoints, setCalculatingPoints] = useState(false);
  const { drivers, isLoadingDrivers } = useDriversData();
  
  const query = useQuery({
    queryKey: ["race-results", raceId],
    queryFn: async () => {
      console.log("Fetching race results for:", raceId);
      
      if (!raceId) {
        throw new Error("Race ID is required");
      }
      
      // First get race details
      const { data: race, error: raceError } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();
      
      if (raceError) throw raceError;
      
      // Then get results
      const { data: results, error: resultsError } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .single();
      
      if (resultsError && resultsError.code !== 'PGRST116') {
        // PGRST116 is the error code for no rows returned
        throw resultsError;
      }
      
      // Get predictions with profiles data for usernames
      const { data: predictions, error: predictionsError } = await supabase
        .from("predictions")
        .select("*, profiles(username)")
        .eq("race_id", raceId);
        
      if (predictionsError) throw predictionsError;

      // Ensure race result has required fields with defaults if needed
      const typedResult = results ? {
        ...results,
        pole_time: results.pole_time || '', // Default to empty string if null/undefined
        fastest_lap: results.fastest_lap || null,
        dnf_drivers: results.dnf_drivers || []
      } as RaceResultsResponse : null;
      
      return {
        race: race as Race,
        results: typedResult,
        predictions: predictions || []
      };
    },
    enabled: !!raceId,
  });

  // Process points function - this is a mock implementation
  // Replace with actual implementation if needed
  const processPoints = async () => {
    try {
      setCalculatingPoints(true);
      console.log("Processing points for race:", raceId);
      // Here you would call your points calculation logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
    } catch (error) {
      console.error("Error processing points:", error);
    } finally {
      setCalculatingPoints(false);
    }
  };

  // Format predictions to have the correct type
  const formattedPredictions = query.data?.predictions?.map(prediction => {
    // Ensure the prediction has the profiles property with username
    return {
      ...prediction,
      profiles: {
        username: prediction.profiles?.username || 'Unknown User'
      }
    } as Prediction & { profiles: { username: string } };
  }) || [];

  // Maintain backward compatibility with the old interface
  return {
    ...query,
    race: query.data?.race,
    drivers: drivers,
    raceResult: query.data?.results as unknown as RaceResult, // Type assertion to match expected type
    existingResult: query.data?.results as unknown as RaceResult, // Type assertion to match expected type
    predictions: formattedPredictions,
    isLoadingDrivers,
    calculatingPoints,
    processPoints,
    loading: query.isLoading,
    refetch: query.refetch,
    raceId
  };
}
