
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Driver {
  id: string;
  name: string;
  number: number;
}

interface TeamDriversListProps {
  drivers: Driver[];
}

const TeamDriversList = ({ drivers }: TeamDriversListProps) => {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Pilotos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drivers?.map((driver) => (
          <Card 
            key={driver.id} 
            className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
            onClick={() => navigate(`/driver/${driver.id}`)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-racing-white flex items-center">
                <span className="mr-2 bg-racing-red text-white text-sm px-2 py-1 rounded">{driver.number}</span>
                {driver.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-racing-silver">Clique para ver mais detalhes</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamDriversList;
