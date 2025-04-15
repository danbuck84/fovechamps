
import { formatDate } from "@/utils/date-utils";

interface Race {
  id: string;
  name: string;
  date: string;
}

interface PastRacesListProps {
  races: Race[];
  selectedRaceId: string | null;
  onRaceSelect: (raceId: string) => void;
  isLoading: boolean;
}

export const PastRacesList = ({ 
  races, 
  selectedRaceId, 
  onRaceSelect, 
  isLoading 
}: PastRacesListProps) => {
  return (
    <>
      {isLoading ? (
        <p className="text-racing-silver">Carregando corridas...</p>
      ) : races && races.length > 0 ? (
        <div className="space-y-2">
          {races.map((race) => (
            <div 
              key={race.id}
              onClick={() => onRaceSelect(race.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedRaceId === race.id 
                  ? "bg-racing-red/10 border border-racing-red" 
                  : "bg-racing-silver/5 border border-racing-silver/20 hover:bg-racing-silver/10"
              }`}
            >
              <h3 className="font-semibold text-racing-white">{race.name}</h3>
              <p className="text-sm text-racing-silver">{formatDate(race.date)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-racing-silver">Nenhuma corrida passada encontrada.</p>
      )}
    </>
  );
};
