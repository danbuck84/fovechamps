
import { useNavigate } from "react-router-dom";

interface Team {
  id?: string;
  name: string;
  engine: string;
}

interface DriverTeamInfoProps {
  team?: Team;
}

const DriverTeamInfo = ({ team }: DriverTeamInfoProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Equipe Atual</h3>
      <div className="space-y-3">
        <p className="text-racing-silver flex items-center">
          <span>Nome: </span>
          <span 
            className="text-racing-red hover:text-racing-white cursor-pointer ml-2"
            onClick={() => team?.id && navigate(`/team/${team.id}`)}
          >
            {team?.name || "N/A"}
          </span>
        </p>
        <p className="text-racing-silver">
          <span>Motor: </span>
          <span className="text-racing-white ml-2">{team?.engine || "N/A"}</span>
        </p>
      </div>
    </div>
  );
};

export default DriverTeamInfo;
