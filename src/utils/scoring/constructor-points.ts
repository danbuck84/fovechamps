
import { supabase } from "@/lib/supabase";
import { calculatePoints } from "./constants";

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
