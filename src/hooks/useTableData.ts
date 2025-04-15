
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Race, Driver, Team, Profile } from "@/types/betting";
import type { DriverPoints, ConstructorPoints, GamePoints, GroupedPoints, TotalPointsData } from "@/types/tables";

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

  // Buscar todos os pilotos e suas equipes
  const { data: allDrivers } = useQuery({
    queryKey: ["all-drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(name, engine)");
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
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
    // Desabilitamos o cache para garantir dados atualizados
    staleTime: 0,
    refetchOnWindowFocus: true,
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
    // Desabilitamos o cache para garantir dados atualizados
    staleTime: 0,
    refetchOnWindowFocus: true,
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
    // Desabilitamos o cache para garantir dados atualizados
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Processar dados para o formato agrupado
  const processTableData = (): TotalPointsData | undefined => {
    if (!races || !driverPoints || !constructorPoints || !allDrivers) return undefined;

    // Agrupar pontos dos pilotos
    const groupedDriverPoints = driverPoints.reduce((acc, point) => {
      if (!point.driver) return acc;

      const driverInfo = allDrivers.find(d => d.id === point.driver_id);
      const teamName = driverInfo?.team?.name || "";
      
      const existingDriver = acc.find(d => d.id === point.driver_id);
      if (existingDriver) {
        existingDriver.points[point.race_id] = point.points;
      } else {
        const newDriver = {
          id: point.driver_id,
          name: point.driver.name,
          number: point.driver.number,
          team_id: point.driver.team_id,
          team_name: teamName,
          nationality: "N/A", // Placeholder - will be updated with real data
          points: { [point.race_id]: point.points } as Record<string, number>
        };
        acc.push(newDriver);
      }
      return acc;
    }, [] as GroupedPoints[]);

    // Agrupar pontos dos construtores
    const groupedTeamPoints = constructorPoints.reduce((acc, point) => {
      if (!point.team) return acc;

      const existingTeam = acc.find(t => t.id === point.team_id);
      if (existingTeam) {
        existingTeam.points[point.race_id] = point.points;
      } else {
        const newTeam = {
          id: point.team_id,
          name: point.team.name,
          engine: point.team.engine,
          points: { [point.race_id]: point.points } as Record<string, number>
        };
        acc.push(newTeam);
      }
      return acc;
    }, [] as GroupedPoints[]);

    return {
      drivers: groupedDriverPoints,
      teams: groupedTeamPoints
    };
  };

  return {
    races,
    driverPoints,
    constructorPoints,
    gamePoints,
    processTableData
  };
};
