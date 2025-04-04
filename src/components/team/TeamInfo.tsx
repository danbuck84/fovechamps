
import { MapPin, Shield, Wrench, Car, Calendar } from "lucide-react";

interface TeamInfoProps {
  base: string;
  teamChief: string;
  techChief: string;
  chassis: string;
  engine: string;
  firstEntry: number;
}

const TeamInfo = ({ base, teamChief, techChief, chassis, engine, firstEntry }: TeamInfoProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Informações da Equipe</h3>
      <div className="space-y-3">
        <p className="flex items-start text-racing-silver">
          <MapPin className="h-4 w-4 mr-2 text-racing-red mt-1" />
          <span>Base: </span>
          <span className="text-racing-white ml-2">{base}</span>
        </p>
        <p className="flex items-start text-racing-silver">
          <Shield className="h-4 w-4 mr-2 text-racing-red mt-1" />
          <span>Chefe de Equipe: </span>
          <span className="text-racing-white ml-2">{teamChief}</span>
        </p>
        <p className="flex items-start text-racing-silver">
          <Wrench className="h-4 w-4 mr-2 text-racing-red mt-1" />
          <span>Diretor Técnico: </span>
          <span className="text-racing-white ml-2">{techChief}</span>
        </p>
        <p className="flex items-start text-racing-silver">
          <Car className="h-4 w-4 mr-2 text-racing-red mt-1" />
          <span>Chassi: </span>
          <span className="text-racing-white ml-2">{chassis}</span>
        </p>
        <p className="flex items-start text-racing-silver">
          <span>Motor: </span>
          <span className="text-racing-white ml-2">{engine}</span>
        </p>
        <p className="flex items-start text-racing-silver">
          <Calendar className="h-4 w-4 mr-2 text-racing-red mt-1" />
          <span>Primeira Participação: </span>
          <span className="text-racing-white ml-2">{firstEntry}</span>
        </p>
      </div>
    </div>
  );
};

export default TeamInfo;
