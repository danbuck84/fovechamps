
import { supabase } from "@/lib/supabase";

// Sistema de pontuação da F1
export const POINTS_SYSTEM = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1
};

export const calculatePoints = (position: number): number => {
  return POINTS_SYSTEM[position as keyof typeof POINTS_SYSTEM] || 0;
};

export const calculateDriverPoints = async (raceId: string) => {
  // Buscar os resultados da corrida
  const { data: raceResults, error: raceError } = await supabase
    .from('race_results')
    .select('race_results')
    .eq('race_id', raceId)
    .single();

  if (raceError) {
    console.error("Erro ao buscar resultados da corrida:", raceError);
    throw raceError;
  }
  
  if (!raceResults?.race_results || !raceResults.race_results.length) {
    console.error("Nenhum resultado de corrida encontrado para calcular pontos");
    return;
  }

  console.log("Calculando pontos para os pilotos com base nos resultados:", raceResults.race_results);

  // Para cada piloto nos resultados, calcular e salvar os pontos
  const pointsPromises = raceResults.race_results.map(async (driverId, position) => {
    if (!driverId) return null;

    // Só os 10 primeiros marcam pontos
    const points = calculatePoints(position + 1);
    
    console.log(`Piloto ${driverId} na posição ${position + 1} recebe ${points} pontos`);
    
    // Salvar pontos do piloto
    const { error } = await supabase
      .from('driver_race_points')
      .upsert({
        driver_id: driverId,
        race_id: raceId,
        points
      });

    if (error) {
      console.error(`Erro ao salvar pontos para o piloto ${driverId}:`, error);
      throw error;
    }
    
    return { driverId, points };
  });

  await Promise.all(pointsPromises.filter(p => p !== null));
  console.log("Pontos dos pilotos calculados e salvos com sucesso!");
};

export const calculateConstructorPoints = async (raceId: string) => {
  // Buscar resultados da corrida com os pontos dos pilotos
  const { data: driverPoints, error: driverError } = await supabase
    .from('driver_race_points')
    .select(`
      driver_id,
      points,
      driver:drivers(
        team_id
      )
    `)
    .eq('race_id', raceId);

  if (driverError) {
    console.error("Erro ao buscar pontos dos pilotos:", driverError);
    throw driverError;
  }
  
  if (!driverPoints || !driverPoints.length) {
    console.error("Nenhum ponto de piloto encontrado para calcular pontos de construtores");
    return;
  }

  console.log("Calculando pontos para construtores com base nos pontos dos pilotos:", driverPoints);

  // Agrupar pontos por equipe
  const constructorPoints = driverPoints.reduce((acc, curr) => {
    const teamId = curr.driver?.team_id;
    if (!teamId) {
      console.warn(`Piloto ${curr.driver_id} não tem equipe associada`);
      return acc;
    }

    acc[teamId] = (acc[teamId] || 0) + (curr.points || 0);
    return acc;
  }, {} as Record<string, number>);

  console.log("Pontos agrupados por equipe:", constructorPoints);

  // Salvar pontos das equipes
  const pointsPromises = Object.entries(constructorPoints).map(async ([teamId, points]) => {
    console.log(`Equipe ${teamId} recebe ${points} pontos`);
    
    const { error } = await supabase
      .from('constructor_race_points')
      .upsert({
        team_id: teamId,
        race_id: raceId,
        points
      });

    if (error) {
      console.error(`Erro ao salvar pontos para a equipe ${teamId}:`, error);
      throw error;
    }
  });

  await Promise.all(pointsPromises);
  console.log("Pontos dos construtores calculados e salvos com sucesso!");
};

// Function to calculate both driver and constructor points
export const calculateAllPoints = async (raceId: string) => {
  console.log(`Iniciando cálculo de pontos para a corrida ${raceId}`);
  try {
    await calculateDriverPoints(raceId);
    await calculateConstructorPoints(raceId);
    console.log("Cálculo de pontos concluído com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro ao calcular pontos:", error);
    throw error;
  }
};

// Re-exportar calculatePoints como calculateTotalPoints para manter compatibilidade
export const calculateTotalPoints = calculatePoints;
