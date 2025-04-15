
import DriverCard from "./DriverCard";

interface Driver {
  id: string;
  name: string;
  number: number;
  team?: {
    id?: string;
    name: string;
  };
}

interface DriversTabContentProps {
  drivers: Driver[];
  onTeamClick: (teamId: string) => void;
}

const DriversTabContent = ({ drivers, onTeamClick }: DriversTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers?.map((driver) => (
        <DriverCard 
          key={driver.id} 
          driver={driver} 
          onTeamClick={onTeamClick} 
        />
      ))}
    </div>
  );
};

export default DriversTabContent;
