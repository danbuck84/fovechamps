
import PredictionItem from "./PredictionItem";
import type { Driver } from "@/types/betting";

interface ResultsListProps {
  title: string;
  predictions: string[];
  actualResults: string[];
  drivers: (Driver & { team: { name: string } })[];
  isQualifying?: boolean;
}

const ResultsList = ({ 
  title, 
  predictions, 
  actualResults, 
  drivers, 
  isQualifying = false 
}: ResultsListProps) => {
  
  const checkPredictionCorrect = (driverId: string, index: number): boolean => {
    return actualResults[index] === driverId;
  };

  const checkPredictionOffByOne = (driverId: string, index: number): boolean => {
    return (
      actualResults[index - 1] === driverId ||
      actualResults[index + 1] === driverId
    );
  };

  const getActualPosition = (driverId: string): number => {
    return actualResults.findIndex(id => id === driverId) + 1;
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-racing-silver mb-2">{title}</h3>
      <div className="space-y-2">
        {predictions.slice(0, 10).map((driverId, index) => {
          const isCorrect = checkPredictionCorrect(driverId, index);
          const isOffByOne = !isCorrect && checkPredictionOffByOne(driverId, index);
          const actualPos = getActualPosition(driverId);
          
          return (
            <div key={`${isQualifying ? 'qual' : 'race'}-${index}`} className="flex items-center">
              <span className="text-racing-white mr-2">
                {index + 1}.
              </span>
              <div className="flex-1">
                <PredictionItem
                  driverId={driverId}
                  drivers={drivers}
                  isCorrect={isCorrect}
                  isOffByOne={isOffByOne}
                  actualPos={actualPos}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsList;
