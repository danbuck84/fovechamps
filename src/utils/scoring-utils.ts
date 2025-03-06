
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
    .select('race_results, fastest_lap')
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
    let points = calculatePoints(position + 1);
    
    // Ponto extra pela volta mais rápida (se estiver no top 10)
    if (driverId === raceResults.fastest_lap && position < 10) {
      points += 1;
    }
    
    console.log(`Piloto ${driverId} na posição ${position + 1} recebe ${points} pontos`);
    
    try {
      // Verificar se já existe um registro para esta corrida/piloto
      const { data: existingPoints } = await supabase
        .from('driver_race_points')
        .select('id')
        .eq('driver_id', driverId)
        .eq('race_id', raceId)
        .maybeSingle();
        
      if (existingPoints) {
        // Atualizar registro existente
        const { error } = await supabase
          .from('driver_race_points')
          .update({ points })
          .eq('id', existingPoints.id);
        
        if (error) {
          console.error(`Erro ao atualizar pontos para o piloto ${driverId}:`, error);
          throw error;
        }
        
        console.log(`Pontos atualizados para o piloto ${driverId}: ${points}`);
      } else {
        // Criar novo registro
        const { error } = await supabase
          .from('driver_race_points')
          .insert([{
            driver_id: driverId,
            race_id: raceId,
            points
          }]);
        
        if (error) {
          console.error(`Erro ao salvar pontos para o piloto ${driverId}:`, error);
          throw error;
        }
        
        console.log(`Novos pontos criados para o piloto ${driverId}: ${points}`);
      }
      
      return { driverId, points };
    } catch (error) {
      console.error(`Erro ao processar pontos para o piloto ${driverId}:`, error);
      throw error;
    }
  });

  try {
    await Promise.all(pointsPromises.filter(p => p !== null));
    console.log("Pontos dos pilotos calculados e salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar pontos dos pilotos:", error);
    throw error;
  }
};

export const calculateConstructorPoints = async (raceId: string) => {
  try {
    // Buscar resultados da corrida com os pontos dos pilotos
    const { data: raceResults, error: raceError } = await supabase
      .from('race_results')
      .select('race_results, fastest_lap')
      .eq('race_id', raceId)
      .single();
      
    if (raceError) {
      console.error("Erro ao buscar resultados da corrida:", raceError);
      throw raceError;
    }
    
    // Obter todos os pilotos e suas equipes
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select('id, team_id');
      
    if (driversError) {
      console.error("Erro ao buscar pilotos:", driversError);
      throw driversError;
    }
    
    // Calcular pontos por equipe
    const constructorPoints: Record<string, number> = {};
    
    // Processar pontos da corrida
    raceResults.race_results.forEach((driverId, position) => {
      if (!driverId) return;
      
      const driver = drivers.find(d => d.id === driverId);
      if (!driver || !driver.team_id) {
        console.warn(`Piloto ${driverId} não tem equipe associada`);
        return;
      }
      
      const points = position < 10 ? calculatePoints(position + 1) : 0;
      
      // Adicionar ponto pela volta mais rápida
      const fastLapPoint = (driverId === raceResults.fastest_lap && position < 10) ? 1 : 0;
      
      constructorPoints[driver.team_id] = (constructorPoints[driver.team_id] || 0) + points + fastLapPoint;
    });
    
    console.log("Pontos calculados por equipe:", constructorPoints);
    
    // Salvar pontos das equipes
    const pointsPromises = Object.entries(constructorPoints).map(async ([teamId, points]) => {
      console.log(`Equipe ${teamId} recebe ${points} pontos`);
      
      try {
        // Verificar se já existe um registro para esta corrida/equipe
        const { data: existingPoints } = await supabase
          .from('constructor_race_points')
          .select('id')
          .eq('team_id', teamId)
          .eq('race_id', raceId)
          .maybeSingle();
          
        if (existingPoints) {
          // Atualizar registro existente
          const { error } = await supabase
            .from('constructor_race_points')
            .update({ points })
            .eq('id', existingPoints.id);
          
          if (error) {
            console.error(`Erro ao atualizar pontos para a equipe ${teamId}:`, error);
            throw error;
          }
          
          console.log(`Pontos atualizados para a equipe ${teamId}: ${points}`);
        } else {
          // Criar novo registro
          const { error } = await supabase
            .from('constructor_race_points')
            .insert([{
              team_id: teamId,
              race_id: raceId,
              points
            }]);
          
          if (error) {
            console.error(`Erro ao salvar pontos para a equipe ${teamId}:`, error);
            throw error;
          }
          
          console.log(`Novos pontos criados para a equipe ${teamId}: ${points}`);
        }
      } catch (error) {
        console.error(`Erro ao processar pontos para a equipe ${teamId}:`, error);
        throw error;
      }
    });
    
    await Promise.all(pointsPromises);
    console.log("Pontos dos construtores calculados e salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao calcular pontos dos construtores:", error);
    throw error;
  }
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
