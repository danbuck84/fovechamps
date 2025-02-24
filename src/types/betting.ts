
export interface Race {
  id: string;
  name: string;
  date: string;
  qualifying_date: string;
  circuit: string;
  country: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  race_id: string;
  pole_position: string;
  pole_time: string;
  fastest_lap: string;
  top_10: string[];
  qualifying_top_10: string[];
  dnf_predictions: string[];
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  points: number;
  avatar_url?: string;
}

export interface Driver {
  id: string;
  name: string;
  number: number;
  team_id: string;
}

export interface Team {
  id: string;
  name: string;
  engine: string;
}

export interface RaceResult {
  id: string;
  race_id: string;
  qualifying_results: string[];
  race_results: string[];
  pole_time: string;
  fastest_lap: string;
  dnf_drivers: string[];
  created_at: string;
}

export interface RacePoints {
  id: string;
  user_id: string;
  race_id: string;
  prediction_id: string;
  qualifying_points: number;
  race_points: number;
  pole_time_points: number;
  fastest_lap_points: number;
  dnf_points: number;
  total_points: number;
  created_at: string;
}
