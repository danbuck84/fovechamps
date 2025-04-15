
import { Check } from "lucide-react";
import DriverInfo from "./DriverInfo";
import type { Driver } from "@/types/betting";

interface AdditionalPredictionsProps {
  fastestLap: string | undefined;
  actualFastestLap: string | null;
  dnfPredictions: string[];
  drivers: (Driver & { team: { name: string } })[];
}

const AdditionalPredictions = ({ 
  fastestLap, 
  actualFastestLap, 
  dnfPredictions, 
  drivers 
}: AdditionalPredictionsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-racing-silver mb-2">Volta Mais Rápida</h3>
        <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
          <DriverInfo driverId={fastestLap || ''} drivers={drivers} />
          {fastestLap === actualFastestLap && (
            <Check className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-racing-silver mb-2">Sobreviventes</h3>
        <div className="p-2 bg-racing-silver/10 rounded">
          <span className="text-racing-white">{dnfPredictions.length}</span>
        </div>
      </div>
    </div>
  );
};

export default AdditionalPredictions;
