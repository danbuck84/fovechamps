
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Driver {
  id: string;
  name: string;
  number: number;
}

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    engine: string;
    drivers?: Driver[];
  };
  onDriverClick: (driverId: string) => void;
}

const TeamCard = ({ team, onDriverClick }: TeamCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={team.id} 
      className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
      onClick={() => navigate(`/team/${team.id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-racing-white">{team.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-racing-silver mb-2">
          <p>Motor: {team.engine}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-racing-white mb-2">Pilotos:</h4>
          <div className="space-y-1">
            {team.drivers?.map((driver) => (
              <div 
                key={driver.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onDriverClick(driver.id);
                }}
                className="text-racing-red hover:text-racing-white cursor-pointer transition-colors"
              >
                {driver.name} ({driver.number})
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
