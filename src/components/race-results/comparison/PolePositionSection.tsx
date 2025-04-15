
import { Check } from "lucide-react";
import DriverInfo from "./DriverInfo";
import type { Driver } from "@/types/betting";

interface PolePositionSectionProps {
  polePosition: string;
  poleTime: string;
  actualPolePosition: string;
  actualPoleTime: string;
  drivers: (Driver & { team: { name: string } })[];
}

const PolePositionSection = ({ 
  polePosition, 
  poleTime, 
  actualPolePosition, 
  actualPoleTime, 
  drivers 
}: PolePositionSectionProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-racing-silver mb-2">Pole Position</h3>
        <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
          <DriverInfo driverId={polePosition} drivers={drivers} />
          {polePosition === actualPolePosition && (
            <Check className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-racing-silver mb-2">Tempo da Pole</h3>
        <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
          <span className="text-racing-white">{poleTime}</span>
          {poleTime === actualPoleTime && (
            <Check className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default PolePositionSection;
