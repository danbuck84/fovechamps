
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
