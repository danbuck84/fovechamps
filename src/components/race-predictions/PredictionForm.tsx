
import { PolePositionForm } from "./PolePositionForm";
import { QualifyingPredictionForm } from "./QualifyingPredictionForm";
import { RacePredictionForm } from "./RacePredictionForm";
import { DNFPredictionForm } from "./DNFPredictionForm";
import { FastestLapSelector } from "./FastestLapSelector";
import type { Driver } from "@/types/betting";
import { useRef, useEffect } from "react";
import { CopyGridButton } from "./CopyGridButton";
import { PredictionFormActions } from "./PredictionFormActions";
import { usePredictionFormHandlers } from "./usePredictionFormHandlers";

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
  const formRef = useRef<HTMLFormElement>(null);
  const poleTimeRef = useRef<HTMLInputElement>(null);
  const qualifyingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const raceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fastestLapRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    qualifyingRefs.current = qualifyingRefs.current.slice(0, qualifyingTop10.length);
    raceRefs.current = raceRefs.current.slice(0, raceTop10.length);
  }, [qualifyingTop10.length, raceTop10.length]);

  const handlers = usePredictionFormHandlers({
    isDeadlinePassed,
    setQualifyingTop10,
    setRaceTop10,
    setFastestLap,
    onDriverDNF,
    poleTime,
    qualifyingTop10,
    raceTop10,
    fastestLap,
    refs: {
      poleTimeRef,
      qualifyingRefs,
      raceRefs,
      fastestLapRef,
    },
    onSubmit,
  });

  return (
    <form ref={formRef} onSubmit={handlers.handleSubmit} className="space-y-8">
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
        <CopyGridButton
          isDeadlinePassed={isDeadlinePassed}
          onCopyGrid={handlers.handleCopyQualifyingToRace}
        />
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

      <PredictionFormActions
        isDeadlinePassed={isDeadlinePassed}
        handleClearPredictions={handlers.handleClearPredictions}
      />
    </form>
  );
};
