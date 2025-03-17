
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useMyPredictions = (userId: string | null) => {
  const [driversMap, setDriversMap] = useState<Record<string, string>>({});

  // Fetch all drivers once
  useEffect(() => {
    const fetchDrivers = async () => {
      const { data: drivers, error } = await supabase
        .from('drivers')
        .select('id, name');
      
      if (error) {
        console.error('Erro ao buscar pilotos:', error);
        return;
      }

      const driverMapping = drivers.reduce((acc: Record<string, string>, driver) => {
        acc[driver.id] = driver.name;
        return acc;
      }, {});

      setDriversMap(driverMapping);
    };

    fetchDrivers();
  }, []);

  const { data: predictions, isLoading, error, refetch } = useQuery({
    queryKey: ["my-predictions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          races (
            id,
            name,
            circuit,
            country,
            date,
            qualifying_date
          )
        `)
        .eq("user_id", userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro na consulta:", error);
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

  return { 
    predictions, 
    isLoading, 
    error, 
    driversMap,
    refetch 
  };
};
