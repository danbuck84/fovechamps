
import { calculatePoints, calculateTotalPoints, POINTS_SYSTEM } from './constants';
import { calculateDriverPoints } from './driver-points';
import { calculateConstructorPoints } from './constructor-points';

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

// Export all functions and constants
export {
  calculatePoints,
  calculateTotalPoints,
  POINTS_SYSTEM,
  calculateDriverPoints,
  calculateConstructorPoints
};
