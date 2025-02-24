
import type { RaceResult } from "@/types/betting";

interface ScoringInput {
  pole_time: string;
  qualifying_results: string[];
  top_10: string[];
  fastest_lap: string;
  dnf_predictions: string[];
}

export const calculateTotalPoints = (prediction: ScoringInput, result: RaceResult) => {
  let total = 0;
  let qualifyingPoints = 0;
  let racePoints = 0;
  let poleTimePoints = 0;
  let fastestLapPoints = 0;
  let dnfPoints = 0;

  // Pontuação para grid de largada
  prediction.qualifying_results.forEach((driverId, index) => {
    if (result.qualifying_results[index] === driverId) {
      qualifyingPoints += 10;
    } else if (result.qualifying_results.includes(driverId)) {
      qualifyingPoints += 5;
    }
  });

  // Pontuação para resultado da corrida
  prediction.top_10.forEach((driverId, index) => {
    if (result.race_results[index] === driverId) {
      racePoints += 10;
    } else if (result.race_results.includes(driverId)) {
      racePoints += 5;
    }
  });

  // Pontuação para tempo da pole
  if (prediction.pole_time === result.pole_time) {
    poleTimePoints = 20;
  }

  // Pontuação para volta mais rápida
  if (prediction.fastest_lap === result.fastest_lap) {
    fastestLapPoints = 15;
  }

  // Pontuação para abandonos
  prediction.dnf_predictions.forEach(driverId => {
    if (result.dnf_drivers.includes(driverId)) {
      dnfPoints += 10;
    }
  });

  total = qualifyingPoints + racePoints + poleTimePoints + fastestLapPoints + dnfPoints;

  return {
    qualifying_points: qualifyingPoints,
    race_points: racePoints,
    pole_time_points: poleTimePoints,
    fastest_lap_points: fastestLapPoints,
    dnf_points: dnfPoints,
    total_points: total,
  };
};
