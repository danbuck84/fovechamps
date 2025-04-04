
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

const DriversAndTeams = () => {
  const [activeTab, setActiveTab] = useState<string>("drivers");
  const navigate = useNavigate();
  
  const { data: drivers, isLoading: loadingDrivers } = useQuery({
    queryKey: ["all-drivers-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(*)")
        .order("name");
        
      if (error) throw error;

      // Manually adjust team assignments for Tsunoda and Lawson
      const modifiedData = data.map(driver => {
        if (driver.name === "Yuki Tsunoda" && driver.team) {
          // Move Tsunoda to Red Bull
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "Red Bull Racing",
              engine: "Honda RBPT"
            }
          };
        } else if (driver.name === "Liam Lawson" && driver.team) {
          // Move Lawson to RB (formerly AlphaTauri)
          return {
            ...driver,
            team: {
              ...driver.team,
              name: "RB",
              engine: "Honda RBPT"
            }
          };
        }
        return driver;
      });
      
      return modifiedData;
    },
  });
  
  const { data: teams, isLoading: loadingTeams } = useQuery({
    queryKey: ["all-teams-details"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("*, drivers(*)")
        .order("name");
        
      if (error) throw error;

      // Modify drivers in each team based on our swap
      const modifiedTeams = data.map(team => {
        // For Red Bull Racing
        if (team.name === "Red Bull Racing") {
          const updatedDrivers = team.drivers 
            ? team.drivers.filter(d => d.name !== "Liam Lawson") 
            : [];
            
          // Add Tsunoda to Red Bull if we have the drivers data
          if (drivers) {
            const tsunoda = drivers.find(d => d.name === "Yuki Tsunoda");
            if (tsunoda) {
              updatedDrivers.push(tsunoda);
            }
          }
          
          return {
            ...team,
            drivers: updatedDrivers
          };
        }
        // For RB (formerly AlphaTauri)
        else if (team.name === "RB") {
          const updatedDrivers = team.drivers 
            ? team.drivers.filter(d => d.name !== "Yuki Tsunoda") 
            : [];
            
          // Add Lawson to RB if we have the drivers data
          if (drivers) {
            const lawson = drivers.find(d => d.name === "Liam Lawson");
            if (lawson) {
              updatedDrivers.push(lawson);
            }
          }
          
          return {
            ...team,
            drivers: updatedDrivers
          };
        }
        return team;
      });
      
      return modifiedTeams;
    },
    enabled: !!drivers,
  });
  
  const handleDriverClick = (driverId: string) => {
    navigate(`/driver/${driverId}`);
  };
  
  const handleTeamClick = (teamId: string) => {
    navigate(`/team/${teamId}`);
  };

  if (loadingDrivers || loadingTeams) {
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers?.map((driver) => (
                  <Card 
                    key={driver.id} 
                    className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
                    onClick={() => handleDriverClick(driver.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-racing-white flex items-center">
                        <span className="mr-2 bg-racing-red text-white text-sm px-2 py-1 rounded">{driver.number}</span>
                        {driver.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-racing-silver">
                        <p>
                          Equipe: 
                          <span 
                            className="ml-1 text-racing-red hover:text-racing-white cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (driver.team?.id) {
                                handleTeamClick(driver.team.id);
                              }
                            }}
                          >
                            {driver.team?.name || "N/A"}
                          </span>
                        </p>
                        <p>Número: {driver.number}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="teams" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams?.map((team) => (
                  <Card 
                    key={team.id} 
                    className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
                    onClick={() => handleTeamClick(team.id)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-racing-white">{team.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-racing-silver mb-2">
                        <p>Motor: {team.engine}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-racing-white mb-2">Pilotos:</h4>
                        <div className="space-y-1">
                          {team.drivers?.map((driver) => (
                            <div 
                              key={driver.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDriverClick(driver.id);
                              }}
                              className="text-racing-red hover:text-racing-white cursor-pointer transition-colors"
                            >
                              {driver.name} ({driver.number})
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default DriversAndTeams;
