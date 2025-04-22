
import { useOpenF1TableData } from "@/hooks/useOpenF1TableData";
import { PointsTable } from "@/components/tables/PointsTable";
import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Tables = () => {
  const [selectedSeason, setSelectedSeason] = useState<number>(2024);
  const { races, driversStandings, teamsStandings, loading, currentSeason } = useOpenF1TableData(selectedSeason);
  const isMobile = useIsMobile();
  
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
          <p className="text-racing-silver">Carregando dados...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black text-racing-white p-4 md:p-6">
        <div className={`max-w-5xl mx-auto ${isMobile ? 'px-2' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">
              Tabelas de Classificação
            </h1>
            
            <div className="w-full md:w-auto">
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => setSelectedSeason(parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-racing-black text-racing-white border-racing-silver/20">
                  <SelectValue placeholder="Selecione a temporada" />
                </SelectTrigger>
                <SelectContent className="bg-racing-black text-racing-white border-racing-silver/20">
                  <SelectItem value="2024" className="hover:bg-racing-white/10">2024</SelectItem>
                  <SelectItem value="2023" className="hover:bg-racing-white/10">2023</SelectItem>
                  <SelectItem value="2022" className="hover:bg-racing-white/10">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mx-auto overflow-x-auto">
            {/* Tabela de Pilotos */}
            <PointsTable 
              title="Campeonato de Pilotos"
              data={driversStandings}
              races={races || []}
              getName={(driver) => `${driver.name}`}
              getPoints={(driver, raceId) => driver.points[raceId] || 0}
              isDrivers={true}
              getNationality={(driver) => driver.nationality || "N/A"}
              getTeam={(driver) => driver.team_name || ""}
            />
            
            {/* Tabela de Construtores */}
            <PointsTable 
              title="Campeonato de Construtores"
              data={teamsStandings}
              races={races || []}
              getName={(team) => `${team.name}`}
              getPoints={(team, raceId) => team.points[raceId] || 0}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tables;
