
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RaceInfoFieldsProps {
  raceNumber: string;
  raceCountry: string;
  raceName: string;
  raceCircuit: string;
  setRaceNumber: (number: string) => void;
  setRaceCountry: (country: string) => void;
  setRaceName: (name: string) => void;
  setRaceCircuit: (circuit: string) => void;
}

export const RaceInfoFields = ({
  raceNumber,
  raceCountry,
  raceName,
  raceCircuit,
  setRaceNumber,
  setRaceCountry,
  setRaceName,
  setRaceCircuit
}: RaceInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="race-number" className="text-racing-white">Etapa</Label>
        <Input 
          id="race-number" 
          value={raceNumber} 
          onChange={(e) => setRaceNumber(e.target.value)}
          placeholder="Número da etapa (ex: 01, 24)"
          className="bg-transparent border-racing-silver text-racing-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="race-country" className="text-racing-white">País</Label>
        <Input 
          id="race-country" 
          value={raceCountry} 
          onChange={(e) => setRaceCountry(e.target.value)}
          placeholder="País onde será sediada a etapa"
          className="bg-transparent border-racing-silver text-racing-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="race-name" className="text-racing-white">Nome oficial do GP</Label>
        <Input 
          id="race-name" 
          value={raceName} 
          onChange={(e) => setRaceName(e.target.value)}
          placeholder="Nome oficial da etapa"
          className="bg-transparent border-racing-silver text-racing-white"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="race-circuit" className="text-racing-white">Circuito</Label>
        <Input 
          id="race-circuit" 
          value={raceCircuit} 
          onChange={(e) => setRaceCircuit(e.target.value)}
          placeholder="Circuito onde acontecerá a corrida"
          className="bg-transparent border-racing-silver text-racing-white"
        />
      </div>
    </>
  );
};
