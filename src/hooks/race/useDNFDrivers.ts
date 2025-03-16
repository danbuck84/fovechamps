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
    // Clear all current DNF selections if setting to zero
    if (count === 0) {
      setDNFDrivers([]);
    } else {
      // Keep existing DNF selections up to the new count
      // This is a simple implementation that just maintains the count
      // A more complete implementation would need UI for selecting specific drivers
      setDNFDrivers(prev => prev.slice(0, count));
    }
  };

  return {
    dnfDrivers,
    setDNFDrivers,
    handleDNFChange,
    handleDNFCount
  };
};
