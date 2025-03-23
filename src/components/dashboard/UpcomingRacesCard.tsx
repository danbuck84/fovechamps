
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { RaceResultsRow } from "@/components/ui/RaceResultsRow";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Race } from "@/types/betting";

interface UpcomingRacesCardProps {
  races: Race[] | undefined;
  hasResults: (raceId: string) => boolean;
}

export const UpcomingRacesCard = ({ races, hasResults }: UpcomingRacesCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
      <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
        <CardTitle className="text-xl text-racing-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-racing-red" />
          Próximas Corridas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {races && races.length > 0 ? (
          <div className="divide-y divide-racing-silver/10">
            {races.map((race) => (
              <div 
                key={race.id}
                className="p-4 hover:bg-racing-red/5 transition-colors"
              >
                <h3 className="font-semibold text-racing-white text-lg mb-1">{race.name}</h3>
                <div className="flex items-center text-sm text-racing-silver mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(race.date)}
                  <span className="mx-2">•</span>
                  {race.circuit}
                </div>
                <RaceResultsRow 
                  raceId={race.id} 
                  hasResults={hasResults(race.id)}
                  raceName={race.name} 
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="p-4 text-racing-silver">Nenhuma corrida programada.</p>
        )}
      </CardContent>
    </Card>
  );
};
