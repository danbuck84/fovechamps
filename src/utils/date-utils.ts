
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from "date-fns/locale";

// Format date for display in Brazilian Portuguese
export const formatDate = (date: string) => {
  return formatInTimeZone(
    new Date(date),
    'America/Sao_Paulo',
    "d 'de' MMMM 'às' HH:mm",
    { locale: ptBR }
  );
};

// Get date object in a specific timezone
export const getDateInTimeZone = (date: string, timeZone: string = 'America/Sao_Paulo') => {
  // Create date object and convert to the specified timezone
  return new Date(date);
};

// Compare if current time has passed a specific date, always using UTC for comparison
export const isDeadlinePassed = (deadlineDate: string) => {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  
  // Compare dates in UTC to avoid timezone issues
  return now >= deadline;
};
