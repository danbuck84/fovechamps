
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
  const { data, isLoading } = useQuery({
    queryKey: ["openf1-drivers", currentSeason],
    queryFn: async () => {
      try {
        return await fetchDrivers({ season: currentSeason });
      } catch {
        toast.error("Não foi possível carregar os pilotos desta temporada");
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    drivers: data || [],
    loadingDrivers: isLoading,
  };
}
