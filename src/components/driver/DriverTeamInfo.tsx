
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'mb-4' : ''}`}>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Equipe Atual</h3>
      <div className="space-y-3">
        <p className="text-racing-silver flex items-center flex-wrap">
          <span>Nome: </span>
          <span 
            className="text-racing-red hover:text-racing-white cursor-pointer ml-2"
            onClick={() => team?.id && navigate(`/team/${team.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && team?.id && navigate(`/team/${team.id}`)}
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
