
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useFormatters } from "./useFormatters";
import type { RaceResult } from "@/types/betting";

export const useRaceResultsSave = (
  raceId: string | undefined,
  existingResult: RaceResult | null,
  processPoints: () => Promise<void>,
  refetch: () => Promise<any>
) => {
  const [saving, setSaving] = useState(false);
  const { formatDisplayPoleTime } = useFormatters();

  const saveResults = async (
    poleTime: string,
    fastestLap: string,
    qualifyingResults: string[],
    raceResults: string[],
    dnfDrivers: string[]
  ) => {
    if (!raceId) return;
    
    setSaving(true);
    
    try {
      // Format pole time for storage if needed
      const formattedPoleTime = formatDisplayPoleTime(poleTime);
      
      const result = {
        race_id: raceId,
        qualifying_results: qualifyingResults,
        race_results: raceResults,
        pole_time: formattedPoleTime,
        fastest_lap: fastestLap,
        dnf_drivers: dnfDrivers
      };

      // Verificar se já existe um resultado para atualizar ou criar novo
      const { error } = existingResult 
        ? await supabase.from("race_results").update(result).eq("id", existingResult.id)
        : await supabase.from("race_results").insert(result);

      if (error) throw error;
      
      await refetch();
      toast.success("Resultados salvos com sucesso!");
      
      // Calcular pontos automaticamente após salvar
      await processPoints();
      toast.success("Pontos calculados e salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      toast.error("Erro ao salvar resultados");
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    saveResults
  };
};
