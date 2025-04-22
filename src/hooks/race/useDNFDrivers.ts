
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

  // Este método agora recebe a contagem de sobreviventes como string e converte para número
  const handleDNFCount = (survivorCountStr: string) => {
    const survivorCount = parseInt(survivorCountStr, 10);
    console.log("Handling survivor count:", survivorCount);
    
    // Calculate DNF count based on total drivers (20) minus survivors
    const dnfCount = 20 - survivorCount;
    
    // Update DNF drivers list
    if (dnfCount === 0) {
      // If there are no DNFs, clear the list
      setDNFDrivers([]);
    } else if (dnfDrivers.length > dnfCount) {
      // If we need to reduce DNFs, trim the list
      setDNFDrivers(prev => prev.slice(0, dnfCount));
    } else if (dnfDrivers.length < dnfCount) {
      // If we need more DNFs, log this (UI will need to handle selecting specific drivers)
      console.log(`Precisamos selecionar mais ${dnfCount - dnfDrivers.length} pilotos DNF`);
    }
  };

  return {
    dnfDrivers,
    setDNFDrivers,
    handleDNFChange,
    handleDNFCount
  };
};
