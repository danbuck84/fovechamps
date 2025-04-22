
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

  // Esta função recebe o número de sobreviventes diretamente
  const handleDNFCount = (survivorCount: number) => {
    console.log("Handling survivor count:", survivorCount);
    // Calculamos quantos DNFs temos com base no número total de pilotos (20) 
    // menos o número de sobreviventes
    const dnfCount = 20 - survivorCount;
    
    // Resetamos a lista de DNFs quando a contagem muda
    setDNFDrivers(prev => {
      if (dnfCount === 0) {
        // Se não houver DNFs, retornamos uma lista vazia
        return [];
      } else if (prev.length > dnfCount) {
        // Se precisamos reduzir o número de DNFs, cortamos a array
        return prev.slice(0, dnfCount);
      } else if (prev.length < dnfCount) {
        // Se precisamos mais pilotos DNF, mantemos o estado atual
        // Na implementação real, você precisaria de uma UI para selecionar quais pilotos
        // específicos devem ser adicionados para atingir a contagem desejada
        console.log(`Precisamos selecionar mais ${dnfCount - prev.length} pilotos DNF`);
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
