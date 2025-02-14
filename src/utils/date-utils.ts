
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from "date-fns/locale";

export const formatDate = (date: string) => {
  return formatInTimeZone(
    new Date(date),
    'America/Sao_Paulo',
    "d 'de' MMMM 'às' HH:mm",
    { locale: ptBR }
  );
};
