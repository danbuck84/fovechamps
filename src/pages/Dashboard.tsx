
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Race, Prediction } from "@/types/betting";

const Dashboard = () => {
  const { data: nextRaces } = useQuery({
    queryKey: ["next-races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true })
        .limit(3);

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-racing-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Próximas Corridas */}
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Próximas Corridas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextRaces?.map((race) => (
              <Link 
                key={race.id}
                to={`/race-predictions/${race.id}`}
                className="block p-4 border-b border-racing-silver/20 last:border-0 hover:bg-racing-red/10 transition-colors rounded-lg"
              >
                <h3 className="font-semibold text-racing-white">{race.name}</h3>
                <p className="text-sm text-racing-silver">{race.circuit}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Palpites Recentes */}
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Seus Últimos Palpites
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentPredictions?.map((prediction) => (
              <div 
                key={prediction.id}
                className="p-4 border-b border-racing-silver/20 last:border-0"
              >
                <h3 className="font-semibold text-racing-white">
                  {prediction.race.name}
                </h3>
                <p className="text-sm text-racing-silver">
                  {prediction.qualifying_top_10[0] && "Pole Position Prevista"}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
