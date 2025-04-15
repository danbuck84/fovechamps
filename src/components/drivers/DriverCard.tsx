
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DriverCardProps {
  driver: {
    id: string;
    name: string;
    number: number;
    team?: {
      id?: string;
      name: string;
    };
  };
  onTeamClick: (teamId: string) => void;
}

const DriverCard = ({ driver, onTeamClick }: DriverCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      key={driver.id} 
      className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
      onClick={() => navigate(`/driver/${driver.id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-racing-white flex items-center">
          <span className="mr-2 bg-racing-red text-white text-sm px-2 py-1 rounded">{driver.number}</span>
          {driver.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-racing-silver">
          <p>
            Equipe: 
            <span 
              className="ml-1 text-racing-red hover:text-racing-white cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (driver.team?.id) {
                  onTeamClick(driver.team.id);
                }
              }}
            >
              {driver.team?.name || "N/A"}
            </span>
          </p>
          <p>Número: {driver.number}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
