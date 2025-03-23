import { useState } from "react";

export const useDNFDrivers = (initialDNFDrivers: string[] = []) => {
  const [dnfDrivers, setDNFDrivers] = useState<string[]>(initialDNFDrivers);

  const handleDNFChange = (driverId: string, checked: boolean) => {
    if (checked) {
      setDNFDrivers(prev => [...prev, driverId]);
    } else {
      setDNFDrivers(prev => prev.filter(id => id !== driverId));
    }
  };

  const handleDNFCount = (count: number) => {
    // Update DNF drivers count
    // This implementation just maintains the count without specifying which drivers
    // The UI would need to provide a way to select specific drivers
    
    // Create a new array with the desired length
    if (count === 0) {
      setDNFDrivers([]);
    } else {
      // If we already have drivers marked as DNF, keep as many as needed
      const newDNFDrivers = [...dnfDrivers];
      
      // If we need to reduce the number, slice the array
      if (newDNFDrivers.length > count) {
        setDNFDrivers(newDNFDrivers.slice(0, count));
      }
      // Otherwise, we would need a UI to select specific additional drivers
      // This simple implementation just maintains the count
    }
  };

  return {
    dnfDrivers,
    setDNFDrivers,
    handleDNFChange,
    handleDNFCount
  };
};
