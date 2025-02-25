
import type { DriverPoints, ConstructorPoints, GamePoints, GroupedPoints } from "@/types/tables";

export const groupDriverPoints = (driverPoints: DriverPoints[]): Record<string, GroupedPoints> => {
  return driverPoints.reduce((acc, point) => {
    if (!acc[point.driver_id]) {
      acc[point.driver_id] = {
        id: point.driver_id,
        driver: point.driver,
        points: {},
      };
    }
    acc[point.driver_id].points[point.race_id] = point.points;
    return acc;
  }, {} as Record<string, GroupedPoints>);
};

export const groupConstructorPoints = (constructorPoints: ConstructorPoints[]): Record<string, GroupedPoints> => {
  return constructorPoints.reduce((acc, point) => {
    if (!acc[point.team_id]) {
      acc[point.team_id] = {
        id: point.team_id,
        team: point.team,
        points: {},
      };
    }
    acc[point.team_id].points[point.race_id] = point.points;
    return acc;
  }, {} as Record<string, GroupedPoints>);
};

export const groupGamePoints = (gamePoints: GamePoints[], gameType: string): Record<string, GroupedPoints> => {
  return gamePoints
    .filter((point) => point.game_type === gameType)
    .reduce((acc, point) => {
      if (!acc[point.user_id]) {
        acc[point.user_id] = {
          id: point.user_id,
          profile: point.profile,
          points: {},
        };
      }
      acc[point.user_id].points[point.race_id] = point.points;
      return acc;
    }, {} as Record<string, GroupedPoints>);
};
