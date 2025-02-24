
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

interface RaceResult {
  race_id: string;
  qualifying_results: string[];
  race_results: string[];
  pole_time: string;
  fastest_lap: string;
  dnf_drivers: string[];
}

interface Prediction {
  id: string;
  user_id: string;
  qualifying_top_10: string[];
  top_10: string[];
  pole_time: string;
  fastest_lap: string;
  dnf_predictions: string[];
}

const calculatePoleTimeDifference = (prediction: string, actual: string): number => {
  const predictionNum = parseInt(prediction.replace(/\D/g, ''));
  const actualNum = parseInt(actual.replace(/\D/g, ''));
  return Math.abs(predictionNum - actualNum);
};

const calculateQualifyingPoints = (prediction: string[], actual: string[]): number => {
  let points = 0;
  const top10 = actual.slice(0, 10);

  prediction.forEach((driverId, index) => {
    if (index >= 10) return;
    const actualPosition = top10.indexOf(driverId);
    
    if (actualPosition === index) {
      points += 3;
    } else if (actualPosition === index - 1 || actualPosition === index + 1) {
      points += 2;
    } else if (actualPosition !== -1) {
      points += 1;
    } else {
      points -= 1;
    }
  });

  return points;
};

const calculateDNFPoints = (prediction: string[], actual: string[]): number => {
  const totalDrivers = 20;
  const predictedSurvivors = totalDrivers - prediction.length;
  const actualSurvivors = totalDrivers - actual.length;
  const difference = Math.abs(predictedSurvivors - actualSurvivors);

  if (difference === 0) return 5;
  if (difference === 1) return 3;
  if (difference === 2) return 2;
  if (difference === 3) return 1;
  return 0;
};

const calculateRacePoints = (prediction: string[], actual: string[]): number => {
  const pointsDistribution = [25, 18, 15, 12, 12, 12, 12, 12, 12, 12];
  let points = 0;

  prediction.forEach((driverId, index) => {
    if (index >= 10) return;
    const actualPosition = actual.indexOf(driverId);
    if (actualPosition !== -1 && actualPosition < 10) {
      points += pointsDistribution[actualPosition];
    }
  });

  return points;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { raceResult } = await req.json();
    const result = raceResult as RaceResult;

    // Buscar todas as previsões para esta corrida
    const { data: predictions, error: predictionsError } = await supabaseClient
      .from('predictions')
      .select('*')
      .eq('race_id', result.race_id);

    if (predictionsError) {
      throw predictionsError;
    }

    // Calcular pontos para cada previsão
    const pointsPromises = predictions.map(async (prediction: Prediction) => {
      const qualifyingPoints = calculateQualifyingPoints(prediction.qualifying_top_10, result.qualifying_results);
      const baseRacePoints = calculateRacePoints(prediction.top_10, result.race_results);
      const poleTimeDiff = calculatePoleTimeDifference(prediction.pole_time, result.pole_time);
      const fastestLapPoints = prediction.fastest_lap === result.fastest_lap ? 9 : 0;
      const dnfPoints = calculateDNFPoints(prediction.dnf_predictions, result.dnf_drivers);

      // Pontos do tempo da pole
      let poleTimePoints = 0;
      if (poleTimeDiff === 0) poleTimePoints = 10;
      else if (poleTimeDiff <= 100) poleTimePoints = 5;
      else if (poleTimeDiff <= 250) poleTimePoints = 3;
      else if (poleTimeDiff <= 500) poleTimePoints = 1;

      // Bônus de 5 pontos para quem acertou o tempo da pole
      const racePoints = baseRacePoints + (poleTimeDiff === 0 ? 5 : 0);
      const totalPoints = qualifyingPoints + racePoints + poleTimePoints + fastestLapPoints + dnfPoints;

      // Salvar os pontos da corrida
      await supabaseClient
        .from('race_points')
        .insert({
          race_id: result.race_id,
          prediction_id: prediction.id,
          user_id: prediction.user_id,
          qualifying_points: qualifyingPoints,
          race_points: racePoints,
          pole_time_points: poleTimePoints,
          fastest_lap_points: fastestLapPoints,
          dnf_points: dnfPoints,
          total_points: totalPoints,
        });

      // Atualizar a pontuação total do usuário
      const { data: userPoints } = await supabaseClient
        .from('race_points')
        .select('total_points')
        .eq('user_id', prediction.user_id);

      const totalUserPoints = userPoints?.reduce((sum, p) => sum + (p.total_points || 0), 0) || 0;

      await supabaseClient
        .from('profiles')
        .update({ points: totalUserPoints })
        .eq('id', prediction.user_id);

      return { user_id: prediction.user_id, points: totalPoints };
    });

    await Promise.all(pointsPromises);

    return new Response(
      JSON.stringify({ message: 'Pontuações atualizadas com sucesso' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});
