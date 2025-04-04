
interface TeamStatsProps {
  championships: number;
  poles: number;
  fastestLaps: number;
  highestFinish: string;
}

const TeamStats = ({ championships, poles, fastestLaps, highestFinish }: TeamStatsProps) => {
  return (
    <div>
      <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Estatísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Campeonatos</p>
          <p className="text-racing-white text-2xl font-bold">{championships}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Poles</p>
          <p className="text-racing-white text-2xl font-bold">{poles}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Voltas Mais Rápidas</p>
          <p className="text-racing-white text-2xl font-bold">{fastestLaps}</p>
        </div>
        <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
          <p className="text-racing-silver text-sm">Melhor Resultado</p>
          <p className="text-racing-white text-xl font-bold">{highestFinish}</p>
        </div>
      </div>
    </div>
  );
};

export default TeamStats;
