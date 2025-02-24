
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PolePositionForm } from "./PolePositionForm";
import { QualifyingPredictionForm } from "./QualifyingPredictionForm";
import { RacePredictionForm } from "./RacePredictionForm";
import { DNFPredictionForm } from "./DNFPredictionForm";
import { FastestLapSelector } from "./FastestLapSelector";
import type { Driver } from "@/types/betting";

interface PredictionFormProps {
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

export const PredictionForm = ({
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
}: PredictionFormProps) => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      <FastestLapSelector
        drivers={drivers}
        fastestLap={fastestLap}
        setFastestLap={setFastestLap}
        disabled={isDeadlinePassed}
      />

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
