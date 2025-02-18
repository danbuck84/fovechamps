
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface RacePredictionFormProps {
  raceTop10: string[];
  setRaceTop10: (value: string[]) => void;
  dnfPredictions: string[];
  onDriverDNF: (driverId: string) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
  disabled?: boolean;
}

export const RacePredictionForm = ({
  raceTop10,
  setRaceTop10,
  dnfPredictions,
  onDriverDNF,
  getAvailableDrivers,
  allDrivers,
  disabled = false,
}: RacePredictionFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Palpites da Corrida</h3>
        <p className="text-sm text-racing-silver">
          Faça seus palpites para o resultado final da corrida, prevendo as 11 primeiras posições.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {raceTop10.map((_, index) => (
          <div key={`race-${index}`} className="space-y-2">
            <label className="text-sm text-racing-silver">
              {index + 1}º Lugar
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select
                  value={raceTop10[index]}
                  onValueChange={(value) => {
                    const newTop10 = [...raceTop10];
                    newTop10[index] = value;
                    setRaceTop10(newTop10);
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                    <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
                  </SelectTrigger>
                  <SelectContent className="bg-racing-black border-racing-silver/20">
                    {getAvailableDrivers(index, false).map((driver) => (
                      <SelectItem key={driver.id} value={driver.id} className="text-racing-white hover:bg-racing-silver/20">
                        {driver.name} ({driver.team.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold">Previsão de Abandonos</h4>
          <p className="text-sm text-racing-silver">
            Selecione quantos pilotos você acredita que não completarão a corrida.
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <Select
            value={dnfPredictions.length.toString()}
            onValueChange={(value) => {
              // When the user selects a new number of DNFs,
              // we reset the array and call onDriverDNF with an empty array
              onDriverDNF("");
            }}
            disabled={disabled}
          >
            <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
              <SelectValue placeholder="Selecione o número de abandonos" />
            </SelectTrigger>
            <SelectContent className="bg-racing-black border-racing-silver/20">
              {Array.from({ length: 21 }, (_, i) => (
                <SelectItem 
                  key={i} 
                  value={i.toString()}
                  className="text-racing-white hover:bg-racing-silver/20"
                >
                  {i} {i === 1 ? 'piloto' : 'pilotos'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
