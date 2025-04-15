
import TeamCard from "./TeamCard";

interface Driver {
  id: string;
  name: string;
  number: number;
}

interface Team {
  id: string;
  name: string;
  engine: string;
  drivers?: Driver[];
}

interface TeamsTabContentProps {
  teams: Team[];
  onDriverClick: (driverId: string) => void;
}

const TeamsTabContent = ({ teams, onDriverClick }: TeamsTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {teams?.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team} 
          onDriverClick={onDriverClick} 
        />
      ))}
    </div>
  );
};

export default TeamsTabContent;
