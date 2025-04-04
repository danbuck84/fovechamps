
import { Card, CardContent } from "@/components/ui/card";

interface DriverStatsProps {
  stats: {
    country: string;
    podiums: number;
    points: number;
    gp: number;
    championships: number;
    highest_finish: string;
    highest_grid: number;
    dob: string;
    pob: string;
  };
}

const DriverStats = ({ stats }: DriverStatsProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Grandes Prêmios</p>
          <p className="text-racing-white text-2xl font-bold">{stats.gp}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Pódios</p>
          <p className="text-racing-white text-2xl font-bold">{stats.podiums}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Pontos</p>
          <p className="text-racing-white text-2xl font-bold">{stats.points}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Campeonatos</p>
          <p className="text-racing-white text-2xl font-bold">{stats.championships}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <p className="text-racing-silver">
          <span>Melhor Posição em Corrida: </span>
          <span className="text-racing-white">{stats.highest_finish}</span>
        </p>
        <p className="text-racing-silver">
          <span>Melhor Posição no Grid: </span>
          <span className="text-racing-white">{stats.highest_grid}</span>
        </p>
      </div>
    </div>
  );
};

export default DriverStats;
