
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import DriversTabContent from "@/components/drivers/DriversTabContent";
import TeamsTabContent from "@/components/teams/TeamsTabContent";
import { useDriversAndTeamsData } from "@/hooks/useDriversAndTeamsData";

const DriversAndTeams = () => {
  const [activeTab, setActiveTab] = useState<string>("drivers");
  const navigate = useNavigate();
  const { drivers, teams, isLoading } = useDriversAndTeamsData();
  
  const handleDriverClick = (driverId: string) => {
    navigate(`/driver/${driverId}`);
  };
  
  const handleTeamClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-racing-silver">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-racing-white mb-6 text-center">Pilotos e Equipes</h1>
          
          <Tabs defaultValue="drivers" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-racing-black border border-racing-silver/20 h-auto">
                <TabsTrigger 
                  value="drivers" 
                  className="data-[state=active]:bg-racing-red data-[state=active]:text-racing-white text-racing-silver px-8 py-2.5"
                >
                  Pilotos
                </TabsTrigger>
                <TabsTrigger 
                  value="teams" 
                  className="data-[state=active]:bg-racing-red data-[state=active]:text-racing-white text-racing-silver px-8 py-2.5"
                >
                  Equipes
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="drivers" className="mt-0">
              <DriversTabContent 
                drivers={drivers || []} 
                onTeamClick={handleTeamClick} 
              />
            </TabsContent>
            
            <TabsContent value="teams" className="mt-0">
              <TeamsTabContent 
                teams={teams || []} 
                onDriverClick={handleDriverClick} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default DriversAndTeams;
