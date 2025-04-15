
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
    // Reset DNF drivers array when count changes
    setDNFDrivers(prev => {
      if (count === 0) {
        return [];
      } else if (prev.length > count) {
        // If we need to reduce the number, slice the array
        return prev.slice(0, count);
      } else if (prev.length < count) {
        // Se precisamos de mais pilotos DNF, mantemos o estado atual
        // Na implementação real, você precisaria de uma UI para selecionar quais pilotos
        // específicos devem ser adicionados para atingir a contagem desejada
        console.log(`Need UI to select ${count - prev.length} more DNF drivers`);
      }
      return prev;
    });
  };

  return {
    dnfDrivers,
    setDNFDrivers,
    handleDNFChange,
    handleDNFCount
  };
};
