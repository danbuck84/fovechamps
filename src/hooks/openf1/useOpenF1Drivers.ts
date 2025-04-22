
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
        // For 2025, use 2024 data as fallback since it's a future season
        const actualSeason = currentSeason === 2025 ? 2024 : currentSeason;
        
        const response = await fetchDrivers({ season: actualSeason });
        
        if (!response || !Array.isArray(response)) {
          console.error("Invalid drivers response:", response);
          return [];
        }
        
        // Add nationality data since it's often missing
        const driversWithNationality = response.map(driver => {
          const driverWithNationality = { ...driver };
          
          // Add nationality based on driver name if missing
          if (!driverWithNationality.nationality) {
            switch (driver.name) {
              case "Lewis Hamilton": 
                driverWithNationality.nationality = "British"; break;
              case "Max Verstappen": 
                driverWithNationality.nationality = "Dutch"; break;
              case "Charles Leclerc": 
                driverWithNationality.nationality = "Monégasque"; break;
              case "Carlos Sainz": 
                driverWithNationality.nationality = "Spanish"; break;
              case "Lando Norris": 
                driverWithNationality.nationality = "British"; break;
              case "Oscar Piastri": 
                driverWithNationality.nationality = "Australian"; break;
              case "George Russell": 
                driverWithNationality.nationality = "British"; break;
              case "Fernando Alonso": 
                driverWithNationality.nationality = "Spanish"; break;
              case "Lance Stroll": 
                driverWithNationality.nationality = "Canadian"; break;
              case "Sergio Perez": 
                driverWithNationality.nationality = "Mexican"; break;
              case "Yuki Tsunoda": 
                driverWithNationality.nationality = "Japanese"; break;
              case "Daniel Ricciardo": 
                driverWithNationality.nationality = "Australian"; break;
              case "Alexander Albon": 
                driverWithNationality.nationality = "Thai"; break;
              case "Kevin Magnussen": 
                driverWithNationality.nationality = "Danish"; break;
              case "Nico Hulkenberg": 
                driverWithNationality.nationality = "German"; break;
              case "Esteban Ocon": 
                driverWithNationality.nationality = "French"; break;
              case "Pierre Gasly": 
                driverWithNationality.nationality = "French"; break;
              case "Valtteri Bottas": 
                driverWithNationality.nationality = "Finnish"; break;
              case "Zhou Guanyu": 
                driverWithNationality.nationality = "Chinese"; break;
              case "Logan Sargeant": 
                driverWithNationality.nationality = "American"; break;
              case "Liam Lawson": 
                driverWithNationality.nationality = "New Zealander"; break;
              case "Franco Colapinto": 
                driverWithNationality.nationality = "Argentine"; break;
              case "Oliver Bearman": 
                driverWithNationality.nationality = "British"; break;
              default: 
                driverWithNationality.nationality = "N/A";
            }
          }
          
          return driverWithNationality;
        });
        
        console.log(`Found ${driversWithNationality.length} drivers for season ${currentSeason} (using ${actualSeason} data)`);
        return driversWithNationality;
      } catch (err) {
        console.error(`Error fetching drivers for season ${currentSeason}:`, err);
        toast.error("Não foi possível carregar os pilotos desta temporada");
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    gcTime: 10 * 60 * 1000,
  });

  return {
    drivers: data || [],
    loadingDrivers: isLoading,
    driverError: error,
  };
}
