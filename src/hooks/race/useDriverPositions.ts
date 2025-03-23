
import { useState } from "react";

export const useDriverPositions = (initialResults: string[] = Array(20).fill("")) => {
  const [results, setResults] = useState<string[]>(initialResults);
  
  // Track duplicate positions for validation
  const [duplicates, setDuplicates] = useState<number[]>([]);

  const handleDriverChange = (position: number, driverId: string) => {
    if (driverId === "placeholder") {
      // Remove the driver from the selected position
      const newResults = [...results];
      newResults[position] = "";
      setResults(newResults);
      
      // Recalculate duplicates
      checkForDuplicates(newResults);
      return;
    }

    // Update the position with the selected driver
    const newResults = [...results];
    newResults[position] = driverId;
    setResults(newResults);
    
    // Check for duplicates after updating
    checkForDuplicates(newResults);
  };
  
  // Function to check for duplicates in the array
  const checkForDuplicates = (arr: string[]) => {
    const driverCounts: Record<string, number[]> = {};
    const duplicatePositions: number[] = [];
    
    // Count occurrences of each driver and track positions
    arr.forEach((driverId, index) => {
      if (driverId && driverId !== "placeholder") {
        if (!driverCounts[driverId]) {
          driverCounts[driverId] = [index];
        } else {
          driverCounts[driverId].push(index);
        }
      }
    });
    
    // Mark positions with duplicates
    Object.values(driverCounts).forEach(positions => {
      if (positions.length > 1) {
        positions.forEach(pos => duplicatePositions.push(pos));
      }
    });
    
    setDuplicates(duplicatePositions);
  };
  
  // Check if the current selections have any duplicates
  const hasDuplicates = duplicates.length > 0;
  
  // Function to get all duplicated driver IDs
  const getDuplicatedDrivers = () => {
    const driverCounts: Record<string, number> = {};
    const duplicatedDrivers: string[] = [];
    
    results.forEach((driverId) => {
      if (driverId && driverId !== "placeholder") {
        driverCounts[driverId] = (driverCounts[driverId] || 0) + 1;
      }
    });
    
    Object.entries(driverCounts).forEach(([driverId, count]) => {
      if (count > 1) {
        duplicatedDrivers.push(driverId);
      }
    });
    
    return duplicatedDrivers;
  };

  return {
    results,
    setResults,
    handleDriverChange,
    duplicates,
    hasDuplicates,
    getDuplicatedDrivers
  };
};
