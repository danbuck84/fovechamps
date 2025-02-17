
import { PolePositionForm } from "./PolePositionForm";
import { QualifyingPredictionForm } from "./QualifyingPredictionForm";
import { RacePredictionForm } from "./RacePredictionForm";
import { Button } from "@/components/ui/button";
import type { Driver } from "@/types/betting";

interface RacePredictionFormWrapperProps {
  drivers: (Driver & { team: { name: string; engine: string } })[];
  polePosition: string;
  setPolePosition: (value: string) => void;
  poleTime: string;
  onPoleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  qualifyingTop10: string[];
  setQualifyingTop10: (value: string[]) => void;
  raceTop10: string[];
  setRaceTop10: (value: string[]) => void;
  dnfPredictions: string[];
  onDriverDNF: (driverId: string) => void;
  getAvailableDrivers: (position: number, isQualifying?: boolean) => (Driver & { team: { name: string; engine: string } })[];
  isDeadlinePassed: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const RacePredictionFormWrapper = ({
  drivers,
  polePosition,
  setPolePosition,
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
}: RacePredictionFormWrapperProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <PolePositionForm
        drivers={drivers}
        polePosition={polePosition}
        setPolePosition={setPolePosition}
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
        dnfPredictions={dnfPredictions}
        onDriverDNF={onDriverDNF}
        getAvailableDrivers={getAvailableDrivers}
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
