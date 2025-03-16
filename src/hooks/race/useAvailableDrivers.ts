
import type { Driver } from "@/types/betting";

export const useAvailableDrivers = () => {
  const getAvailableDrivers = (
    position: number,
    qualifyingResults: string[],
    raceResults: string[],
    drivers: (Driver & { team: { name: string; engine: string } })[] | undefined
  ) => {
    if (!drivers) return [];
    
    // Filtrar pilotos que já estão em resultados
    const currentResults = position < 10 ? qualifyingResults : raceResults;
    const selectedDriverId = currentResults[position];
    
    // Retorna todos os pilotos que não estão em outras posições ou está na posição atual
    return drivers.filter(driver => 
      !currentResults.includes(driver.id) || 
      driver.id === selectedDriverId
    );
  };

  return { getAvailableDrivers };
};
