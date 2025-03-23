
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FastestLapSelector } from "./FastestLapSelector";
import { RacePositionsSelector } from "./RacePositionsSelector";
import { DNFSelector } from "./DNFSelector";
import type { Driver } from "@/types/betting";

interface RaceResultsFormProps {
  fastestLap: string;
  onFastestLapChange: (value: string) => void;
  raceResults: string[];
  onRaceDriverChange: (position: number, driverId: string) => void;
  dnfDrivers: string[];
  onDNFChange: (driverId: string, checked: boolean) => void;
  handleDNFCountChange: (value: string) => void;
  allDrivers: (Driver & { team: { name: string; engine: string } })[];
}

export const RaceResultsForm = ({
  fastestLap,
  onFastestLapChange,
  raceResults,
  onRaceDriverChange,
  dnfDrivers,
  onDNFChange,
  handleDNFCountChange,
  allDrivers,
}: RaceResultsFormProps) => {
  return (
    <Card className="bg-racing-black border-racing-silver/20">
      <CardHeader>
        <CardTitle>Resultados da Corrida</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <FastestLapSelector 
            fastestLap={fastestLap}
            onFastestLapChange={onFastestLapChange}
            allDrivers={allDrivers}
          />

          <RacePositionsSelector 
            raceResults={raceResults}
            onRaceDriverChange={onRaceDriverChange}
            allDrivers={allDrivers}
          />

          <DNFSelector 
            dnfDrivers={dnfDrivers}
            onDNFChange={onDNFChange}
            handleDNFCountChange={handleDNFCountChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
