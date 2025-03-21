
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PolePositionForm } from "./PolePositionForm";
import { QualifyingPredictionForm } from "./QualifyingPredictionForm";
import { RacePredictionForm } from "./RacePredictionForm";
import { DNFPredictionForm } from "./DNFPredictionForm";
import { FastestLapSelector } from "./FastestLapSelector";
import type { Driver } from "@/types/betting";
import { useEffect, useRef } from "react";

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
  const formRef = useRef<HTMLFormElement>(null);
  const poleTimeRef = useRef<HTMLInputElement>(null);
  const qualifyingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const raceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fastestLapRef = useRef<HTMLButtonElement>(null);

  // Initialize refs arrays
  useEffect(() => {
    qualifyingRefs.current = qualifyingRefs.current.slice(0, qualifyingTop10.length);
    raceRefs.current = raceRefs.current.slice(0, raceTop10.length);
  }, [qualifyingTop10.length, raceTop10.length]);

  const handleClearPredictions = () => {
    if (isDeadlinePassed) return;
    
    if (window.confirm("Tem certeza que deseja limpar todas as suas apostas?")) {
      setQualifyingTop10(Array(20).fill(""));
      setRaceTop10(Array(20).fill(""));
      setFastestLap("");
      onDriverDNF(0);
      toast({
        title: "Apostas limpas",
        description: "Todas as suas apostas foram limpas",
      });
    }
  };

  const handleCopyQualifyingToRace = () => {
    if (isDeadlinePassed) return;
    
    setRaceTop10([...qualifyingTop10]);
    toast({
      title: "Grid copiado para Resultado da Corrida",
      description: "Grid de largada copiado para resultado da corrida",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for empty pole time
    if (!poleTime) {
      toast({
        title: "Erro",
        description: "Por favor, insira o tempo da pole position",
        variant: "destructive",
      });
      poleTimeRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Check for empty qualifying positions
    const emptyQualifyingIndex = qualifyingTop10.findIndex(driver => !driver);
    if (emptyQualifyingIndex !== -1) {
      toast({
        title: "Erro",
        description: `Por favor, selecione o piloto para a posição ${emptyQualifyingIndex + 1} do grid de largada`,
        variant: "destructive",
      });
      qualifyingRefs.current[emptyQualifyingIndex]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Check for empty race positions
    const emptyRaceIndex = raceTop10.findIndex(driver => !driver);
    if (emptyRaceIndex !== -1) {
      toast({
        title: "Erro",
        description: `Por favor, selecione o piloto para a posição ${emptyRaceIndex + 1} do resultado da corrida`,
        variant: "destructive",
      });
      raceRefs.current[emptyRaceIndex]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Check for empty fastest lap
    if (!fastestLap) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o piloto que fará a volta mais rápida",
        variant: "destructive",
      });
      fastestLapRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    await onSubmit(e);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <PolePositionForm
        poleTime={poleTime}
        onPoleTimeChange={onPoleTimeChange}
        disabled={isDeadlinePassed}
        inputRef={poleTimeRef}
      />

      <QualifyingPredictionForm
        drivers={drivers}
        qualifyingTop10={qualifyingTop10}
        setQualifyingTop10={setQualifyingTop10}
        getAvailableDrivers={getAvailableDrivers}
        disabled={isDeadlinePassed}
        positionRefs={qualifyingRefs}
      />

      <div className="flex flex-wrap gap-4 pt-2">
        <Button
          type="button"
          onClick={handleCopyQualifyingToRace}
          className="bg-racing-blue hover:bg-racing-blue/90 text-racing-white"
          disabled={isDeadlinePassed}
        >
          Usar Grid de Largada como Resultado da Corrida
        </Button>
      </div>

      <RacePredictionForm
        raceTop10={raceTop10}
        setRaceTop10={setRaceTop10}
        getAvailableDrivers={getAvailableDrivers}
        allDrivers={drivers}
        disabled={isDeadlinePassed}
        positionRefs={raceRefs}
      />

      <FastestLapSelector
        drivers={drivers}
        fastestLap={fastestLap}
        setFastestLap={setFastestLap}
        disabled={isDeadlinePassed}
        buttonRef={fastestLapRef}
      />

      <DNFPredictionForm
        dnfPredictions={dnfPredictions}
        onDriverDNF={onDriverDNF}
        disabled={isDeadlinePassed}
      />

      <div className="flex flex-wrap gap-4 justify-between">
        <Button 
          type="button"
          onClick={handleClearPredictions}
          className="bg-racing-silver/20 hover:bg-racing-silver/30 text-racing-white"
          disabled={isDeadlinePassed}
        >
          Limpar Aposta
        </Button>
        
        <Button 
          type="submit"
          className="bg-racing-red hover:bg-racing-red/90 text-racing-white disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isDeadlinePassed}
        >
          Salvar Apostas
        </Button>
      </div>
    </form>
  );
};
