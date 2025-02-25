
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Race, Driver, Team, Profile } from "@/types/betting";
import type { DriverPoints, ConstructorPoints, GamePoints } from "@/types/tables";

export const useTableData = () => {
  // Buscar todas as corridas para usar como colunas
  const { data: races } = useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data as Race[];
    },
  });

  // Buscar pontos dos pilotos
  const { data: driverPoints } = useQuery({
    queryKey: ["driver-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_race_points")
        .select(`
          driver_id,
          race_id,
          points,
          driver:drivers(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as DriverPoints[];
    },
  });

  // Buscar pontos dos construtores
  const { data: constructorPoints } = useQuery({
    queryKey: ["constructor-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("constructor_race_points")
        .select(`
          team_id,
          race_id,
          points,
          team:teams(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as ConstructorPoints[];
    },
  });

  // Buscar pontos dos jogos
  const { data: gamePoints } = useQuery({
    queryKey: ["game-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_points")
        .select(`
          user_id,
          race_id,
          game_type,
          points,
          profile:profiles(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as GamePoints[];
    },
  });

  return {
    races,
    driverPoints,
    constructorPoints,
    gamePoints,
  };
};
