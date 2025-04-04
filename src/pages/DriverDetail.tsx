
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Flag, Calendar, MapPin } from "lucide-react";

const DriverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: driver, isLoading } = useQuery({
    queryKey: ["driver-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(*)")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      
      // Manually adjust team assignment for Tsunoda and Lawson
      if (data.name === "Yuki Tsunoda") {
        return {
          ...data,
          team: {
            ...data.team,
            name: "Red Bull Racing",
            engine: "Honda RBPT"
          },
          team_name: "Red Bull Racing"
        };
      } else if (data.name === "Liam Lawson") {
        return {
          ...data,
          team: {
            ...data.team,
            name: "RB",
            engine: "Honda RBPT"
          },
          team_name: "RB"
        };
      }
      
      return data;
    },
    enabled: !!id,
  });
  
  // Additional driver stats (mock data based on the list provided)
  const getDriverStats = (driverName) => {
    const stats = {
      "Max Verstappen": { 
        country: "Netherlands", 
        podiums: 112, 
        points: 3023.5, 
        gp: 209, 
        championships: 4, 
        highest_finish: "1 (x63)",
        highest_grid: 1,
        dob: "30/09/1997",
        pob: "Hasselt, Belgium"
      },
      "Yuki Tsunoda": { 
        country: "Japan", 
        podiums: 0, 
        points: 91, 
        gp: 87, 
        championships: 0, 
        highest_finish: "4 (x1)",
        highest_grid: 3,
        dob: "11/05/2000",
        pob: "Sagamihara, Japan"
      },
      "Liam Lawson": { 
        country: "New Zealand", 
        podiums: 0, 
        points: 6, 
        gp: 11, 
        championships: 0, 
        highest_finish: "9 (x3)",
        highest_grid: 5,
        dob: "11/02/2002",
        pob: "Hastings, New Zealand"
      },
      "Charles Leclerc": { 
        country: "Monaco", 
        podiums: 43, 
        points: 1430, 
        gp: 147, 
        championships: 0, 
        highest_finish: "1 (x8)",
        highest_grid: 1,
        dob: "16/10/1997",
        pob: "Monte Carlo, Monaco"
      },
      "Lewis Hamilton": { 
        country: "United Kingdom", 
        podiums: 202, 
        points: 4862.5, 
        gp: 356, 
        championships: 7, 
        highest_finish: "1 (x105)",
        highest_grid: 1,
        dob: "07/01/1985",
        pob: "Stevenage, England"
      },
      "Lando Norris": { 
        country: "United Kingdom", 
        podiums: 26, 
        points: 1007, 
        gp: 128, 
        championships: 0, 
        highest_finish: "1 (x4)",
        highest_grid: 1,
        dob: "13/11/1999",
        pob: "Bristol, England"
      },
      // Default stats for any driver not specifically defined
      "default": { 
        country: "Unknown", 
        podiums: 0, 
        points: 0, 
        gp: 0, 
        championships: 0, 
        highest_finish: "N/A",
        highest_grid: 0,
        dob: "Unknown",
        pob: "Unknown"
      }
    };
    
    return stats[driverName] || stats.default;
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-racing-silver">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!driver) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-racing-silver">Piloto não encontrado</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-4 bg-racing-red hover:bg-racing-red/80"
            >
              Voltar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = getDriverStats(driver.name);

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-racing-silver hover:text-racing-white hover:bg-racing-silver/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <Card className="bg-racing-black border-racing-silver/20 mb-6">
            <CardHeader className="border-b border-racing-silver/10 pb-4">
              <CardTitle className="text-3xl font-bold text-racing-white flex items-center">
                <span className="mr-2">{driver.number}</span>
                <span>{driver.name}</span>
              </CardTitle>
              <div className="text-racing-silver flex items-center mt-2">
                <Flag className="h-4 w-4 mr-2" />
                <span>{stats.country}</span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
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

                  <div>
                    <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Equipe Atual</h3>
                    <div className="space-y-3">
                      <p className="text-racing-silver flex items-center">
                        <span>Nome: </span>
                        <span 
                          className="text-racing-red hover:text-racing-white cursor-pointer ml-2"
                          onClick={() => driver.team?.id && navigate(`/team/${driver.team.id}`)}
                        >
                          {driver.team?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-racing-silver">
                        <span>Motor: </span>
                        <span className="text-racing-white ml-2">{driver.team?.engine || "N/A"}</span>
                      </p>
                    </div>
                  </div>
                </div>

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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DriverDetail;
