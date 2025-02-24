
import { PolePositionForm } from "./PolePositionForm";
import { QualifyingPredictionForm } from "./QualifyingPredictionForm";
import { RacePredictionForm } from "./RacePredictionForm";
import { DNFPredictionForm } from "./DNFPredictionForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Driver } from "@/types/betting";

interface RacePredictionFormWrapperProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  poleTime: string;
  onPoleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  qualifyingTop10: string[];
  setQualifyingTop10: (value: string[]) => void;
  raceTop10: string[];
  setRaceTop10: (value: string[]) => void;
  dnfPredictions: string[];
  onDriverDNF: (count: number) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  isDeadlinePassed: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  fastestLap: string;
  setFastestLap: (value: string) => void;
}

export const RacePredictionFormWrapper = ({
  drivers,
  poleTime,
  onPoleTimeChange,
  qualifyingTop10,
  setQualifyingTop10,
  raceTop10,
  setRaceTop10,
  dnfPredictions,
  onDriverDNF,
  getAvailableDrivers,
  isDeadlinePassed,
  onSubmit,
  fastestLap,
  setFastestLap,
}: RacePredictionFormWrapperProps) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se todos os campos estão preenchidos
    if (!poleTime) {
      toast({
        title: "Erro",
        description: "Por favor, insira o tempo da pole position",
        variant: "destructive",
      });
      return;
    }

    if (qualifyingTop10.some(driver => !driver)) {
      toast({
        title: "Erro",
        description: "Por favor, selecione todos os pilotos para o grid de largada",
        variant: "destructive",
      });
      return;
    }

    if (raceTop10.some(driver => !driver)) {
      toast({
        title: "Erro",
        description: "Por favor, selecione todos os pilotos para o resultado da corrida",
        variant: "destructive",
      });
      return;
    }

    if (!fastestLap) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o piloto que fará a volta mais rápida",
        variant: "destructive",
      });
      return;
    }

    // Se passar por todas as validações, envia o formulário
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PolePositionForm
        poleTime={poleTime}
        onPoleTimeChange={onPoleTimeChange}
        disabled={isDeadlinePassed}
      />

      <QualifyingPredictionForm
        drivers={drivers}
        qualifyingTop10={qualifyingTop10}
        setQualifyingTop10={setQualifyingTop10}
        getAvailableDrivers={getAvailableDrivers}
        disabled={isDeadlinePassed}
      />

      <RacePredictionForm
        raceTop10={raceTop10}
        setRaceTop10={setRaceTop10}
        getAvailableDrivers={getAvailableDrivers}
        allDrivers={drivers}
        disabled={isDeadlinePassed}
      />

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-racing-white">Volta Mais Rápida</h3>
        <p className="text-sm text-racing-silver mb-4">
          Selecione o piloto que você acha que fará a volta mais rápida da corrida.
        </p>
        <Select
          value={fastestLap}
          onValueChange={setFastestLap}
          disabled={isDeadlinePassed}
        >
          <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
            <SelectValue placeholder="Selecione um piloto" />
          </SelectTrigger>
          <SelectContent className="bg-racing-black border-racing-silver/20">
            {drivers.map((driver) => (
              <SelectItem 
                key={driver.id} 
                value={driver.id}
                className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer"
              >
                {driver.name} ({driver.team.name})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DNFPredictionForm
        dnfPredictions={dnfPredictions}
        onDriverDNF={onDriverDNF}
        disabled={isDeadlinePassed}
      />

      <Button 
        type="submit"
        className="w-full bg-racing-red hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isDeadlinePassed}
      >
        Salvar Palpites
      </Button>
    </form>
  );
};
