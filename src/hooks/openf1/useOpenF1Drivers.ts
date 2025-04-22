
import { useQuery } from "@tanstack/react-query";
import { fetchDrivers } from "@/services/openf1-api";
import { toast } from "sonner";

export interface OpenF1Driver {
  driver_number: number;
  driver_id: string;
  name: string;
  team_name: string;
  team_id: string;
  nationality?: string;
}

export function useOpenF1Drivers(currentSeason: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["openf1-drivers", currentSeason],
    queryFn: async () => {
      try {
        console.log(`Fetching drivers for season ${currentSeason}`);
        const response = await fetchDrivers({ season: currentSeason });
        
        if (!response || !Array.isArray(response)) {
          console.error("Invalid drivers response:", response);
          return [];
        }
        
        console.log(`Found ${response.length} drivers for season ${currentSeason}`);
        return response;
      } catch (err) {
        console.error(`Error fetching drivers for season ${currentSeason}:`, err);
        toast.error("Não foi possível carregar os pilotos desta temporada");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    // Add a timeout to prevent hanging requests
    gcTime: 10 * 60 * 1000,
  });

  return {
    drivers: data || [],
    loadingDrivers: isLoading,
    driverError: error,
  };
}
