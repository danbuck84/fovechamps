
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
  const { data: raceResults, error: raceError } = await supabase
    .from('race_results')
    .select('race_results')
    .eq('race_id', raceId)
    .single();

  if (raceError) throw raceError;
  if (!raceResults?.race_results) return;

  // Para cada piloto nos resultados, calcular e salvar os pontos
  const pointsPromises = raceResults.race_results.map(async (driverId, position) => {
    if (!driverId) return null;

    const points = calculatePoints(position + 1);
    
    // Salvar pontos do piloto
    const { error } = await supabase
      .from('driver_race_points')
      .upsert({
        driver_id: driverId,
        race_id: raceId,
        points
      });

    if (error) throw error;
    return { driverId, points };
  });

  await Promise.all(pointsPromises.filter(p => p !== null));
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

  if (driverError) throw driverError;
  if (!driverPoints) return;

  // Agrupar pontos por equipe
  const constructorPoints = driverPoints.reduce((acc, curr) => {
    const teamId = curr.driver?.team_id;
    if (!teamId) return acc;

    acc[teamId] = (acc[teamId] || 0) + (curr.points || 0);
    return acc;
  }, {} as Record<string, number>);

  // Salvar pontos das equipes
  const pointsPromises = Object.entries(constructorPoints).map(async ([teamId, points]) => {
    const { error } = await supabase
      .from('constructor_race_points')
      .upsert({
        team_id: teamId,
        race_id: raceId,
        points
      });

    if (error) throw error;
  });

  await Promise.all(pointsPromises);
};

// Re-exportar calculatePoints como calculateTotalPoints para manter compatibilidade
export const calculateTotalPoints = calculatePoints;

