
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
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
  // Convert the UTC date to the specified timezone
  return toZonedTime(new Date(date), timeZone);
};

// Compare if current time has passed a specific date, always using UTC for comparison
export const isDeadlinePassed = (deadlineDate: string) => {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  
  // Compare dates directly since both are in UTC internally
  // This ensures consistent deadline checking regardless of user's timezone
  return now >= deadline;
};
