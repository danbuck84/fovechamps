
import { Clock } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, isDeadlinePassed } from "@/utils/date-utils";
import type { Race } from "@/types/betting";

interface RaceInfoHeaderProps {
  race: Race;
  isDeadlinePassed: boolean;
}

export const RaceInfoHeader = ({ race, isDeadlinePassed }: RaceInfoHeaderProps) => {
  const isDuringRaceWeekend = () => {
    const qualifyingDate = new Date(race.qualifying_date);
    const raceDate = new Date(race.date);
    const now = new Date();

    // If we're between qualifying and race date
    return now >= qualifyingDate && now <= raceDate;
  };

  const getStatusColor = () => {
    const isRaceWeekend = isDuringRaceWeekend();
    
    if (!isDeadlinePassed) return "bg-[#0FA0CE]/10 border-[#0FA0CE]"; // Blue for open bets
    if (isRaceWeekend) return "bg-racing-silver/10 border-racing-silver/20"; // Gray during race weekend
    return "bg-racing-red/10 border-racing-red"; // Red after race weekend
  };

  const getTextColor = () => {
    const isRaceWeekend = isDuringRaceWeekend();
    
    if (!isDeadlinePassed) return "text-[#0FA0CE]"; // Blue for open bets
    if (isRaceWeekend) return "text-racing-silver"; // Gray during race weekend
    return "text-racing-red"; // Red after race weekend
  };

  return (
    <CardHeader>
      <CardTitle className="text-2xl text-racing-white">
        {race.name}
      </CardTitle>
      <p className="text-racing-silver">
        Data da corrida: {formatDate(race.date)}
      </p>
      <p className="text-racing-silver">
        Classificação: {formatDate(race.qualifying_date)}
      </p>
      {isDeadlinePassed ? (
        <div className={`mt-4 p-4 ${getStatusColor()} rounded-md flex items-center gap-2 border`}>
          <Clock className={`h-5 w-5 ${getTextColor()}`} />
          <p className={getTextColor()}>O prazo para apostas já encerrou</p>
        </div>
      ) : (
        <div className={`mt-4 p-4 ${getStatusColor()} rounded-md flex items-center gap-2 border`}>
          <Clock className={`h-5 w-5 ${getTextColor()}`} />
          <p className={getTextColor()}>Prazo para apostas: até {formatDate(race.qualifying_date)}</p>
        </div>
      )}
    </CardHeader>
  );
};
