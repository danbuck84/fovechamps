
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { isDeadlinePassed } from "@/utils/date-utils";
import type { Race } from "@/types/betting";

export const useRaceData = (raceId: string | undefined) => {
  const { data: race, isLoading: isLoadingRace } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("ID da corrida não fornecido");
      
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Corrida não encontrada");

      const qualifyingDate = new Date(data.qualifying_date);
      const now = new Date();

      console.log('Data da Classificação:', qualifyingDate.toLocaleString());
      console.log('Data atual:', now.toLocaleString());
      
      const hasDeadlinePassed = isDeadlinePassed(data.qualifying_date);
      console.log('Prazo encerrado?', hasDeadlinePassed);
      
      return {
        ...data,
        isDeadlinePassed: hasDeadlinePassed
      } as Race & { isDeadlinePassed: boolean };
    },
    enabled: !!raceId,
  });

  return {
    race,
    isLoadingRace,
    isDeadlinePassed: race?.isDeadlinePassed || false
  };
};
