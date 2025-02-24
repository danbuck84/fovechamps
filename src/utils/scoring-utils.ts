
// Calcula a diferença entre dois tempos de pole
export const calculatePoleTimeDifference = (prediction: string, actual: string): number => {
  const predictionNum = parseInt(prediction.replace(/\D/g, ''));
  const actualNum = parseInt(actual.replace(/\D/g, ''));
  return Math.abs(predictionNum - actualNum);
};

// Calcula pontos do grid de classificação
export const calculateQualifyingPoints = (prediction: string[], actual: string[]): number => {
  let points = 0;
  const top10 = actual.slice(0, 10);

  prediction.forEach((driverId, index) => {
    if (index >= 10) return; // Só considera os 10 primeiros

    const actualPosition = top10.indexOf(driverId);
    
    if (actualPosition === index) {
      // Acerto em cheio
      points += 3;
    } else if (actualPosition === index - 1 || actualPosition === index + 1) {
      // Posição adjacente
      points += 2;
    } else if (actualPosition !== -1) {
      // Piloto está no top 10, mas em outra posição
      points += 1;
    } else {
      // Piloto não está no top 10
      points -= 1;
    }
  });

  return points;
};

// Calcula pontos dos sobreviventes (DNFs)
export const calculateDNFPoints = (prediction: string[], actual: string[]): number => {
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

// Calcula pontos da corrida
export const calculateRacePoints = (prediction: string[], actual: string[]): number => {
  const pointsDistribution = [25, 18, 15, 12, 12, 12, 12, 12, 12, 12];
  let points = 0;

  prediction.forEach((driverId, index) => {
    if (index >= 10) return; // Só considera os 10 primeiros
    
    const actualPosition = actual.indexOf(driverId);
    if (actualPosition !== -1 && actualPosition < 10) {
      points += pointsDistribution[actualPosition];
    }
  });

  return points;
};

// Calcula pontos totais de uma previsão
export const calculateTotalPoints = (
  prediction: {
    pole_time: string;
    qualifying_top_10: string[];
    top_10: string[];
    fastest_lap: string;
    dnf_predictions: string[];
  },
  result: {
    pole_time: string;
    qualifying_results: string[];
    race_results: string[];
    fastest_lap: string;
    dnf_drivers: string[];
  }
): {
  qualifying_points: number;
  race_points: number;
  pole_time_points: number;
  fastest_lap_points: number;
  dnf_points: number;
  total_points: number;
} => {
  const qualifyingPoints = calculateQualifyingPoints(prediction.qualifying_top_10, result.qualifying_results);
  const baseRacePoints = calculateRacePoints(prediction.top_10, result.race_results);
  const poleTimeDiff = calculatePoleTimeDifference(prediction.pole_time, result.pole_time);
  const fastestLapPoints = prediction.fastest_lap === result.fastest_lap ? 9 : 0;
  const dnfPoints = calculateDNFPoints(prediction.dnf_predictions, result.dnf_drivers);

  // Pontos do tempo da pole para o ranking de "Tempo da Pole"
  let poleTimePoints = 0;
  if (poleTimeDiff === 0) poleTimePoints = 10;
  else if (poleTimeDiff <= 100) poleTimePoints = 5;
  else if (poleTimeDiff <= 250) poleTimePoints = 3;
  else if (poleTimeDiff <= 500) poleTimePoints = 1;

  // Calcula pontos totais da corrida (incluindo bônus do tempo da pole)
  const racePoints = baseRacePoints + (poleTimeDiff === 0 ? 5 : 0);

  return {
    qualifying_points: qualifyingPoints,
    race_points: racePoints,
    pole_time_points: poleTimePoints,
    fastest_lap_points: fastestLapPoints,
    dnf_points: dnfPoints,
    total_points: qualifyingPoints + racePoints + poleTimePoints + fastestLapPoints + dnfPoints
  };
};
