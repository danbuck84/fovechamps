
import type { Race, Driver, Team, Profile } from "./betting";

export interface DriverPoints {
  driver_id: string;
  race_id: string;
  points: number;
  driver: Driver;
}

export interface ConstructorPoints {
  team_id: string;
  race_id: string;
  points: number;
  team: Team;
}

export interface GamePoints {
  user_id: string;
  race_id: string;
  game_type: string;
  points: number;
  profile: Profile;
}

export interface GroupedPoints {
  id: string;
  points: Record<string, number>;
  [key: string]: any;
}
