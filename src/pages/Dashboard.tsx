
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, BarChart2, List, Trophy } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { RaceResultsRow } from "@/components/ui/RaceResultsRow";
import type { Race, Prediction } from "@/types/betting";

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
    <div className="space-y-6 px-6">
      <h1 className="text-3xl font-bold text-racing-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Próximas Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextRaces && nextRaces.length > 0 ? (
              <div className="space-y-4">
                {nextRaces.map((race) => (
                  <div 
                    key={race.id}
                    className="p-4 border-b border-racing-silver/20 last:border-0 hover:bg-racing-red/10 transition-colors rounded-lg"
                  >
                    <h3 className="font-semibold text-racing-white">{race.name}</h3>
                    <p className="text-sm text-racing-silver mb-2">
                      {formatDate(race.date)} - {race.circuit}
                    </p>
                    <RaceResultsRow 
                      raceId={race.id} 
                      hasResults={hasResults(race.id)}
                      raceName={race.name} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-racing-silver">Nenhuma corrida programada.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Últimas Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastRaces && pastRaces.length > 0 ? (
              <div className="space-y-4">
                {pastRaces.map((race) => (
                  <div 
                    key={race.id}
                    className="p-4 border-b border-racing-silver/20 last:border-0 hover:bg-racing-red/10 transition-colors rounded-lg"
                  >
                    <h3 className="font-semibold text-racing-white">{race.name}</h3>
                    <p className="text-sm text-racing-silver mb-2">
                      {formatDate(race.date)} - {race.circuit}
                    </p>
                    <RaceResultsRow 
                      raceId={race.id} 
                      hasResults={hasResults(race.id)} 
                      raceName={race.name}
                    />
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Link 
                    to="/past-predictions" 
                    className="text-racing-red hover:text-racing-red/80 flex items-center gap-2"
                  >
                    <Trophy className="h-4 w-4" />
                    Ver todas corridas passadas
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-racing-silver">Nenhuma corrida finalizada ainda.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Seus Últimos Palpites
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPredictions?.length > 0 ? (
              <div className="space-y-4">
                {recentPredictions.map((prediction) => (
                  <div 
                    key={prediction.id}
                    onClick={() => navigate(`/race-predictions/${prediction.race_id}`)}
                    className="p-4 border-b border-racing-silver/20 last:border-0 hover:bg-racing-red/10 transition-colors rounded-lg cursor-pointer"
                  >
                    <h3 className="font-semibold text-racing-white">
                      {prediction.race.name}
                    </h3>
                    <p className="text-sm text-racing-silver">
                      {formatDate(prediction.race.date)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Link 
                    to="/my-predictions" 
                    className="text-racing-red hover:text-racing-red/80 flex items-center gap-2"
                  >
                    <List className="h-4 w-4" />
                    Ver todos seus palpites
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-racing-silver">Você ainda não fez nenhuma aposta.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <BarChart2 className="h-16 w-16 text-racing-red mb-4" />
              <div className="text-center">
                <p className="text-racing-silver mb-4">
                  Acesse estatísticas detalhadas das corridas e rankings de usuários
                </p>
                <Link 
                  to="/tables" 
                  className="inline-block px-4 py-2 bg-racing-red hover:bg-racing-red/90 text-white rounded-lg"
                >
                  Ver Estatísticas
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
