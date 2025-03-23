import { useState, useEffect } from "react";

export const useDNFDrivers = (initialDNFDrivers: string[] = []) => {
  const [dnfDrivers, setDNFDrivers] = useState<string[]>(initialDNFDrivers);

  // Update internal state when initialDNFDrivers changes (like when loading from API)
  useEffect(() => {
    if (initialDNFDrivers && initialDNFDrivers.length > 0) {
      setDNFDrivers(initialDNFDrivers);
    }
  }, [initialDNFDrivers]);

  const handleDNFChange = (driverId: string, checked: boolean) => {
    if (checked) {
      setDNFDrivers(prev => [...prev, driverId]);
    } else {
      setDNFDrivers(prev => prev.filter(id => id !== driverId));
    }
  };

  const handleDNFCount = (count: number) => {
    console.log("Handling DNF count:", count);
    // Update DNF drivers count
    if (count === 0) {
      setDNFDrivers([]);
    } else if (dnfDrivers.length > count) {
      // If we need to reduce the number, slice the array
      setDNFDrivers(prev => prev.slice(0, count));
    } else if (dnfDrivers.length < count) {
      // If we need more DNF drivers, we'll keep the current ones
      // Note: In a real implementation, you'd need a UI to select which specific drivers 
      // should be added to reach the desired count
      console.log(`Need UI to select ${count - dnfDrivers.length} more DNF drivers`);
    }
  };

  return {
    dnfDrivers,
    setDNFDrivers,
    handleDNFChange,
    handleDNFCount
  };
};
