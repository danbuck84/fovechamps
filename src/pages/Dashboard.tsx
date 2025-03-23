
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, BarChart2, List, Trophy, Calendar, ArrowRight } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { RaceResultsRow } from "@/components/ui/RaceResultsRow";
import type { Race, Prediction } from "@/types/betting";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: nextRaces } = useQuery({
    queryKey: ["next-races"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .gt("date", now.toISOString())
        .order("date", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Race[];
    },
  });

  const { data: recentPredictions } = useQuery({
    queryKey: ["recent-predictions"],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          race:races (
            name,
            date,
            qualifying_date
          )
        `)
        .eq("user_id", user.data.user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as (Prediction & { 
        race: Pick<Race, "name" | "date" | "qualifying_date"> 
      })[];
    },
  });

  const { data: pastRaces } = useQuery({
    queryKey: ["past-races-dashboard"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .lt("date", now.toISOString())
        .order("date", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Race[];
    },
  });

  const { data: raceResults } = useQuery({
    queryKey: ["race-results-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("race_results")
        .select("race_id")
        .limit(20);

      if (error) throw error;
      return data.map(result => result.race_id);
    },
  });

  // Verificar se uma corrida tem resultados
  const hasResults = (raceId: string) => {
    return raceResults?.includes(raceId) || false;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-racing-white mb-6">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
          <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
            <CardTitle className="text-xl text-racing-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-racing-red" />
              Próximas Corridas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {nextRaces && nextRaces.length > 0 ? (
              <div className="divide-y divide-racing-silver/10">
                {nextRaces.map((race) => (
                  <div 
                    key={race.id}
                    className="p-4 hover:bg-racing-red/5 transition-colors"
                  >
                    <h3 className="font-semibold text-racing-white text-lg mb-1">{race.name}</h3>
                    <div className="flex items-center text-sm text-racing-silver mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(race.date)}
                      <span className="mx-2">•</span>
                      {race.circuit}
                    </div>
                    <RaceResultsRow 
                      raceId={race.id} 
                      hasResults={hasResults(race.id)}
                      raceName={race.name} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-racing-silver">Nenhuma corrida programada.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
          <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
            <CardTitle className="text-xl text-racing-white flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-racing-red" />
              Últimas Corridas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pastRaces && pastRaces.length > 0 ? (
              <div className="divide-y divide-racing-silver/10">
                {pastRaces.map((race) => (
                  <div 
                    key={race.id}
                    className="p-4 hover:bg-racing-red/5 transition-colors"
                  >
                    <h3 className="font-semibold text-racing-white text-lg mb-1">{race.name}</h3>
                    <div className="flex items-center text-sm text-racing-silver mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(race.date)}
                      <span className="mx-2">•</span>
                      {race.circuit}
                    </div>
                    <RaceResultsRow 
                      raceId={race.id} 
                      hasResults={hasResults(race.id)} 
                      raceName={race.name}
                    />
                  </div>
                ))}
                <div className="p-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/past-predictions")}
                    className="text-racing-red hover:text-racing-red/80 hover:bg-racing-red/10"
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Ver todas corridas passadas
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="p-4 text-racing-silver">Nenhuma corrida finalizada ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
          <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
            <CardTitle className="text-xl text-racing-white flex items-center">
              <List className="h-5 w-5 mr-2 text-racing-red" />
              Seus Últimos Palpites
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentPredictions?.length > 0 ? (
              <div className="divide-y divide-racing-silver/10">
                {recentPredictions.map((prediction) => (
                  <div 
                    key={prediction.id}
                    onClick={() => navigate(`/race-predictions/${prediction.race_id}`)}
                    className="p-4 hover:bg-racing-red/5 transition-colors cursor-pointer"
                  >
                    <h3 className="font-semibold text-racing-white text-lg mb-1">
                      {prediction.race.name}
                    </h3>
                    <p className="text-sm text-racing-silver">
                      {formatDate(prediction.race.date)}
                    </p>
                  </div>
                ))}
                <div className="p-4 text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate("/my-predictions")}
                    className="text-racing-red hover:text-racing-red/80 hover:bg-racing-red/10"
                  >
                    <List className="h-4 w-4 mr-1" />
                    Ver todos seus palpites
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="p-4 text-racing-silver">Você ainda não fez nenhuma aposta.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
          <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
            <CardTitle className="text-xl text-racing-white flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-racing-red" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center py-6">
              <BarChart2 className="h-16 w-16 text-racing-red mb-4" />
              <div className="text-center">
                <p className="text-racing-silver mb-4">
                  Acesse estatísticas detalhadas das corridas e rankings de usuários
                </p>
                <Button 
                  variant="default"
                  onClick={() => navigate("/tables")}
                  className="bg-racing-red hover:bg-racing-red/90 text-white"
                >
                  Ver Estatísticas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
