
import { useState } from "react";

export const useDriverPositions = (initialResults: string[] = Array(20).fill("")) => {
  const [results, setResults] = useState<string[]>(initialResults);

  const handleDriverChange = (position: number, driverId: string) => {
    if (driverId === "placeholder") {
      // Remove o piloto da posição selecionada
      const newResults = [...results];
      newResults[position] = "";
      setResults(newResults);
      return;
    }

    // Verificar se o piloto já está em outra posição e removê-lo
    const currentIndex = results.findIndex(id => id === driverId);
    if (currentIndex !== -1 && currentIndex !== position) {
      const newResults = [...results];
      newResults[currentIndex] = "";
      newResults[position] = driverId;
      setResults(newResults);
    } else {
      const newResults = [...results];
      newResults[position] = driverId;
      setResults(newResults);
    }
  };

  return {
    results,
    setResults,
    handleDriverChange
  };
};
