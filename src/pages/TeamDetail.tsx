
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Calendar, MapPin, Car, Shield, Wrench } from "lucide-react";

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: team, isLoading } = useQuery({
    queryKey: ["team-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("teams")
        .select("*, drivers(*)")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      
      // Handle the special case for Red Bull and RB
      if (data.name === "Red Bull Racing") {
        // Add Tsunoda to Red Bull
        const tsunodaQuery = await supabase
          .from("drivers")
          .select("*")
          .ilike("name", "%Tsunoda%")
          .single();
          
        if (!tsunodaQuery.error && tsunodaQuery.data) {
          return {
            ...data,
            drivers: data.drivers.filter(d => d.name !== "Liam Lawson").concat([
              {...tsunodaQuery.data, team: data}
            ])
          };
        }
      } else if (data.name === "RB") {
        // Add Lawson to RB
        const lawsonQuery = await supabase
          .from("drivers")
          .select("*")
          .ilike("name", "%Lawson%")
          .single();
          
        if (!lawsonQuery.error && lawsonQuery.data) {
          return {
            ...data,
            drivers: data.drivers.filter(d => d.name !== "Yuki Tsunoda").concat([
              {...lawsonQuery.data, team: data}
            ])
          };
        }
      }
      
      return data;
    },
    enabled: !!id,
  });
  
  // Team stats based on the provided data
  const getTeamStats = (teamName) => {
    const stats = {
      "Red Bull Racing": {
        fullName: "Oracle Red Bull Racing",
        base: "Milton Keynes, United Kingdom",
        teamChief: "Christian Horner",
        techChief: "Pierre Waché",
        chassis: "RB21",
        firstEntry: 1997,
        championships: 6,
        highestFinish: "1 (x122)",
        poles: 103,
        fastestLaps: 99
      },
      "Ferrari": {
        fullName: "Scuderia Ferrari HP",
        base: "Maranello, Italy",
        teamChief: "Frédéric Vasseur",
        techChief: "Loic Serra & Enrico Gualtieri",
        chassis: "SF-25",
        firstEntry: 1950,
        championships: 16,
        highestFinish: "1 (x249)",
        poles: 253,
        fastestLaps: 263
      },
      "Mercedes": {
        fullName: "Mercedes-AMG PETRONAS Formula One Team",
        base: "Brackley, United Kingdom",
        teamChief: "Toto Wolff",
        techChief: "James Allison",
        chassis: "W16",
        firstEntry: 1970,
        championships: 8,
        highestFinish: "1 (x120)",
        poles: 133,
        fastestLaps: 100
      },
      "McLaren": {
        fullName: "McLaren Formula 1 Team",
        base: "Woking, United Kingdom",
        teamChief: "Andrea Stella",
        techChief: "Peter Prodromou & Neil Houldey",
        chassis: "MCL39",
        firstEntry: 1966,
        championships: 9,
        highestFinish: "1 (x189)",
        poles: 164,
        fastestLaps: 172
      },
      "Aston Martin": {
        fullName: "Aston Martin Aramco Formula One Team",
        base: "Silverstone, United Kingdom",
        teamChief: "Andy Cowell",
        techChief: "Enrico Cardile",
        chassis: "AMR25",
        firstEntry: 2018,
        championships: 0,
        highestFinish: "1 (x1)",
        poles: 1,
        fastestLaps: 3
      },
      "Alpine": {
        fullName: "BWT Alpine Formula One Team",
        base: "Enstone, United Kingdom",
        teamChief: "Oliver Oakes",
        techChief: "David Sanchez",
        chassis: "A525",
        firstEntry: 1986,
        championships: 2,
        highestFinish: "1 (x21)",
        poles: 20,
        fastestLaps: 16
      },
      "Williams": {
        fullName: "Williams Racing",
        base: "Grove, United Kingdom",
        teamChief: "James Vowles",
        techChief: "Pat Fry",
        chassis: "FW47",
        firstEntry: 1978,
        championships: 9,
        highestFinish: "1 (x114)",
        poles: 128,
        fastestLaps: 133
      },
      "RB": {
        fullName: "Visa Cash App Racing Bulls Formula One Team",
        base: "Faenza, Italy",
        teamChief: "Laurent Mekies",
        techChief: "Jody Egginton",
        chassis: "VCARB 02",
        firstEntry: 1985,
        championships: 0,
        highestFinish: "1 (x2)",
        poles: 1,
        fastestLaps: 4
      },
      "Haas": {
        fullName: "MoneyGram Haas F1 Team",
        base: "Kannapolis, United States",
        teamChief: "Ayao Komatsu",
        techChief: "Andrea De Zordo",
        chassis: "VF-25",
        firstEntry: 2016,
        championships: 0,
        highestFinish: "4 (x1)",
        poles: 1,
        fastestLaps: 3
      },
      "Kick Sauber": {
        fullName: "Stake F1 Team Kick Sauber",
        base: "Hinwil, Switzerland",
        teamChief: "Mattia Binotto",
        techChief: "James Key", 
        chassis: "C45",
        firstEntry: 1993,
        championships: 0,
        highestFinish: "1 (x1)",
        poles: 1,
        fastestLaps: 7
      },
      // Default stats
      "default": {
        fullName: "Unknown Team",
        base: "Unknown",
        teamChief: "Unknown",
        techChief: "Unknown",
        chassis: "Unknown",
        firstEntry: 0,
        championships: 0,
        highestFinish: "N/A",
        poles: 0,
        fastestLaps: 0
      }
    };
    
    return stats[teamName] || stats.default;
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
  
  if (!team) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-racing-silver">Equipe não encontrada</p>
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

  const stats = getTeamStats(team.name);

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
              <CardTitle className="text-3xl font-bold text-racing-white">{team.name}</CardTitle>
              <p className="text-racing-silver mt-1">{stats.fullName}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Informações da Equipe</h3>
                    <div className="space-y-3">
                      <p className="flex items-start text-racing-silver">
                        <MapPin className="h-4 w-4 mr-2 text-racing-red mt-1" />
                        <span>Base: </span>
                        <span className="text-racing-white ml-2">{stats.base}</span>
                      </p>
                      <p className="flex items-start text-racing-silver">
                        <Shield className="h-4 w-4 mr-2 text-racing-red mt-1" />
                        <span>Chefe de Equipe: </span>
                        <span className="text-racing-white ml-2">{stats.teamChief}</span>
                      </p>
                      <p className="flex items-start text-racing-silver">
                        <Wrench className="h-4 w-4 mr-2 text-racing-red mt-1" />
                        <span>Diretor Técnico: </span>
                        <span className="text-racing-white ml-2">{stats.techChief}</span>
                      </p>
                      <p className="flex items-start text-racing-silver">
                        <Car className="h-4 w-4 mr-2 text-racing-red mt-1" />
                        <span>Chassi: </span>
                        <span className="text-racing-white ml-2">{stats.chassis}</span>
                      </p>
                      <p className="flex items-start text-racing-silver">
                        <span>Motor: </span>
                        <span className="text-racing-white ml-2">{team.engine}</span>
                      </p>
                      <p className="flex items-start text-racing-silver">
                        <Calendar className="h-4 w-4 mr-2 text-racing-red mt-1" />
                        <span>Primeira Participação: </span>
                        <span className="text-racing-white ml-2">{stats.firstEntry}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Estatísticas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
                      <p className="text-racing-silver text-sm">Campeonatos</p>
                      <p className="text-racing-white text-2xl font-bold">{stats.championships}</p>
                    </div>
                    <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
                      <p className="text-racing-silver text-sm">Poles</p>
                      <p className="text-racing-white text-2xl font-bold">{stats.poles}</p>
                    </div>
                    <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
                      <p className="text-racing-silver text-sm">Voltas Mais Rápidas</p>
                      <p className="text-racing-white text-2xl font-bold">{stats.fastestLaps}</p>
                    </div>
                    <div className="bg-racing-black border border-racing-silver/10 rounded-lg p-4">
                      <p className="text-racing-silver text-sm">Melhor Resultado</p>
                      <p className="text-racing-white text-xl font-bold">{stats.highestFinish}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-medium text-racing-white mb-4 border-b border-racing-silver/10 pb-2">Pilotos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {team.drivers?.map((driver) => (
                    <Card 
                      key={driver.id} 
                      className="bg-racing-black border-racing-silver/20 cursor-pointer hover:border-racing-red transition-colors"
                      onClick={() => navigate(`/driver/${driver.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-racing-white flex items-center">
                          <span className="mr-2 bg-racing-red text-white text-sm px-2 py-1 rounded">{driver.number}</span>
                          {driver.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-racing-silver">Clique para ver mais detalhes</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamDetail;
