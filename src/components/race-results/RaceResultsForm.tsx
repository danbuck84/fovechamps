
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
  duplicates?: number[];
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
  duplicates = [],
}: RaceResultsFormProps) => {
  return (
    <Card className="bg-racing-black border-racing-silver/20 w-full mx-auto">
      <CardHeader className="px-6">
        <CardTitle className="text-xl text-racing-white">Resultados da Corrida</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="grid grid-cols-1 gap-6">
          <FastestLapSelector 
            fastestLap={fastestLap}
            onFastestLapChange={onFastestLapChange}
            allDrivers={allDrivers}
          />

          <RacePositionsSelector 
            raceResults={raceResults}
            onRaceDriverChange={onRaceDriverChange}
            allDrivers={allDrivers}
            duplicates={duplicates}
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
