
import { supabase } from "@/lib/supabase";
import { calculatePoints } from "./constants";

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
