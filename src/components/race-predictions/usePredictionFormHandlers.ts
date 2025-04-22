
import { useToast } from "@/hooks/use-toast";

interface UsePredictionFormHandlersParams {
  isDeadlinePassed: boolean;
  setQualifyingTop10: (arr: string[]) => void;
  setRaceTop10: (arr: string[]) => void;
  setFastestLap: (value: string) => void;
  onDriverDNF: (count: number) => void;
  poleTime: string;
  qualifyingTop10: string[];
  raceTop10: string[];
  fastestLap: string;
  refs: {
    poleTimeRef: React.RefObject<HTMLInputElement>;
    qualifyingRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    raceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
    fastestLapRef: React.RefObject<HTMLButtonElement>;
  }
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function usePredictionFormHandlers(params: UsePredictionFormHandlersParams) {
  const { toast } = useToast();
  const {
    isDeadlinePassed,
    setQualifyingTop10,
    setRaceTop10,
    setFastestLap,
    onDriverDNF,
    poleTime,
    qualifyingTop10,
    raceTop10,
    fastestLap,
    refs,
    onSubmit,
  } = params;

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

    if (!poleTime) {
      toast({
        title: "Erro",
        description: "Por favor, insira o tempo da pole position",
        variant: "destructive",
      });
      refs.poleTimeRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const emptyQualifyingIndex = qualifyingTop10.findIndex(driver => !driver);
    if (emptyQualifyingIndex !== -1) {
      toast({
        title: "Erro",
        description: `Por favor, selecione o piloto para a posição ${emptyQualifyingIndex + 1} do grid de largada`,
        variant: "destructive",
      });
      refs.qualifyingRefs.current[emptyQualifyingIndex]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const emptyRaceIndex = raceTop10.findIndex(driver => !driver);
    if (emptyRaceIndex !== -1) {
      toast({
        title: "Erro",
        description: `Por favor, selecione o piloto para a posição ${emptyRaceIndex + 1} do resultado da corrida`,
        variant: "destructive",
      });
      refs.raceRefs.current[emptyRaceIndex]?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!fastestLap) {
      toast({
        title: "Erro",
        description: "Por favor, selecione o piloto que fará a volta mais rápida",
        variant: "destructive",
      });
      refs.fastestLapRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    await onSubmit(e);
  };

  return {
    handleClearPredictions,
    handleCopyQualifyingToRace,
    handleSubmit
  };
}
