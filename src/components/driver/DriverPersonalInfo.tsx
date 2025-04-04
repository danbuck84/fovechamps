
import { Calendar, MapPin } from "lucide-react";

interface DriverPersonalInfoProps {
  stats: {
    dob: string;
    pob: string;
  };
}

const DriverPersonalInfo = ({ stats }: DriverPersonalInfoProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Informações Pessoais</h3>
      <div className="space-y-3">
        <p className="flex items-center text-racing-silver">
          <Calendar className="h-4 w-4 mr-2 text-racing-red" />
          <span>Data de Nascimento: </span>
          <span className="text-racing-white ml-2">{stats.dob}</span>
        </p>
        <p className="flex items-center text-racing-silver">
          <MapPin className="h-4 w-4 mr-2 text-racing-red" />
          <span>Local de Nascimento: </span>
          <span className="text-racing-white ml-2">{stats.pob}</span>
        </p>
      </div>
    </div>
  );
};

export default DriverPersonalInfo;
