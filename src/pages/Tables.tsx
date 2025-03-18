
import { useTableData } from "@/hooks/useTableData";
import { PointsTable } from "@/components/tables/PointsTable";

const Tables = () => {
  const { races, processTableData } = useTableData();
  
  const tableData = processTableData();
  
  if (!races || !tableData) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tabelas de Classificação</h1>
        
        {/* Tabela de Pilotos */}
        <PointsTable 
          title="Campeonato de Pilotos"
          data={tableData.drivers || []}
          races={races}
          getName={(driver) => `${driver.name}`}
          getPoints={(driver, raceId) => driver.points[raceId] || 0}
          isDrivers={true}
          getNationality={(driver) => driver.nationality || "N/A"}
          getTeam={(driver) => driver.team_name || ""}
        />
        
        {/* Tabela de Construtores */}
        <PointsTable 
          title="Campeonato de Construtores"
          data={tableData.teams || []}
          races={races}
          getName={(team) => `${team.name}`}
          getPoints={(team, raceId) => team.points[raceId] || 0}
        />
      </div>
    </div>
  );
};

export default Tables;
