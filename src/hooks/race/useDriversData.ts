
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Driver } from "@/types/betting";

export const useDriversData = () => {
  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `)
        .order('team_id')
        .order('name');

      if (error) throw error;
      
      // Os pilotos já são ordenados por equipe (team_id)
      // Agora vamos garantir que dentro de cada equipe, eles estejam ordenados por sobrenome
      const sortedDrivers = [...(data as (Driver & { team: { name: string; engine: string } })[])];
      
      sortedDrivers.sort((a, b) => {
        // Primeiro, ordenar por nome da equipe
        if (a.team.name !== b.team.name) {
          return a.team.name.localeCompare(b.team.name);
        }
        
        // Se forem da mesma equipe, ordenar por sobrenome
        const aSurname = a.name.split(' ').slice(1).join(' ');
        const bSurname = b.name.split(' ').slice(1).join(' ');
        
        return aSurname.localeCompare(bSurname);
      });
      
      return sortedDrivers;
    },
  });

  return { drivers, isLoadingDrivers };
};
