
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkRaceAccessibility = (raceDate: Date): boolean => {
  const now = new Date();
  const raceWeek = new Date(raceDate);
  raceWeek.setDate(raceWeek.getDate() - raceWeek.getDay() + 1); // Segunda-feira da semana da corrida
  
  // Se hoje é domingo, não permite acesso
  if (now.getDay() === 0) return false;
  
  // Se estamos na semana da corrida (a partir de segunda-feira)
  if (now >= raceWeek && now < raceDate) {
    return true;
  }
  
  return false;
};
