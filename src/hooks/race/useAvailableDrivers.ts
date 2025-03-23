
import type { Driver } from "@/types/betting";

export const useAvailableDrivers = () => {
  const getAvailableDrivers = (
    position: number,
    qualifyingResults: string[],
    raceResults: string[],
    drivers: (Driver & { team: { name: string; engine: string } })[] | undefined
  ) => {
    if (!drivers) return [];
    
    // Return all drivers, allowing any driver in any position
    return drivers;
  };

  return { getAvailableDrivers };
};
