
export interface GroupedPoints {
  id: string;
  name?: string;
  points: Record<string, number>;
  [key: string]: any;
}

