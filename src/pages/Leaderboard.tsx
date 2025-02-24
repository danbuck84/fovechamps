
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/betting";

const Leaderboard = () => {
  // Buscar todos os usuários e suas pontuações
  const { data: rankings } = useQuery({
    queryKey: ["rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as Profile[];
    },
  });

  if (!rankings) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando ranking...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-2xl">Classificação Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-racing-silver/20">
                    <th className="px-4 py-2 text-left">Posição</th>
                    <th className="px-4 py-2 text-left">Participante</th>
                    <th className="px-4 py-2 text-center">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((profile, index) => (
                    <tr key={profile.id} className="border-b border-racing-silver/20">
                      <td className="px-4 py-2">{index + 1}º</td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        {profile.avatar_url && (
                          <img 
                            src={profile.avatar_url} 
                            alt={profile.username} 
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {profile.username}
                      </td>
                      <td className="px-4 py-2 text-center font-bold">{profile.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
