
import { Clock } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/date-utils";
import type { Race } from "@/types/betting";

interface RaceInfoHeaderProps {
  race: Race;
  isDeadlinePassed: boolean;
}

export const RaceInfoHeader = ({ race, isDeadlinePassed }: RaceInfoHeaderProps) => {
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
        <div className="mt-4 p-4 bg-racing-red/10 border border-racing-red rounded-md flex items-center gap-2">
          <Clock className="h-5 w-5 text-racing-red" />
          <p className="text-racing-red">O prazo para apostas já encerrou</p>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-racing-silver/10 border border-racing-silver/20 rounded-md flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <p>Prazo para apostas: até {formatDate(race.qualifying_date)}</p>
        </div>
      )}
    </CardHeader>
  );
};
