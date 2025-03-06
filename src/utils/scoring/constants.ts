
// Points scoring system constants
export const POINTS_SYSTEM = {
  1: 25,
  2: 18,
  3: 15,
  4: 12,
  5: 10,
  6: 8,
  7: 6,
  8: 4,
  9: 2,
  10: 1
};

export const calculatePoints = (position: number): number => {
  return POINTS_SYSTEM[position as keyof typeof POINTS_SYSTEM] || 0;
};

// Re-export calculatePoints as calculateTotalPoints for backward compatibility
export const calculateTotalPoints = calculatePoints;
