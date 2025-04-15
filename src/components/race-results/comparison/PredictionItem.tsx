
import { Check, AlertTriangle } from "lucide-react";
import type { Driver } from "@/types/betting";
import DriverInfo from "./DriverInfo";

interface PredictionItemProps {
  driverId: string;
  drivers: (Driver & { team: { name: string } })[];
  isCorrect: boolean;
  isOffByOne?: boolean;
  actualPos?: number;
}

const PredictionItem = ({ 
  driverId, 
  drivers, 
  isCorrect, 
  isOffByOne = false, 
  actualPos 
}: PredictionItemProps) => {
  return (
    <div className="flex justify-between items-center p-2 bg-racing-silver/10 rounded">
      <DriverInfo driverId={driverId} drivers={drivers} />
      <div className="flex items-center">
        {isOffByOne && (
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="text-yellow-500 text-xs font-medium">P{actualPos}</span>
          </div>
        )}
        {isCorrect && (
          <Check className="h-5 w-5 text-green-500" />
        )}
      </div>
    </div>
  );
};

export default PredictionItem;
