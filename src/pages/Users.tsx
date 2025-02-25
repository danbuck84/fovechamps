
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/betting";

const Users = () => {
  const { data: users } = useQuery({
    queryKey: ["users-with-predictions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('user:profiles(id, username, avatar_url, points)')
        .not('user', 'is', null);

      if (error) throw error;

      // Remover duplicatas e extrair perfis únicos
      const uniqueUsers = Array.from(new Set(data.map(p => p.user.id)))
        .map(id => data.find(p => p.user.id === id)?.user)
        .filter(user => user !== undefined) as Profile[];

      return uniqueUsers.sort((a, b) => (b.points || 0) - (a.points || 0));
    },
  });

  if (!users) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando participantes...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-2xl">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <Link 
                  key={user.id}
                  to={`/users/${user.id}`}
                  className="block transition-transform hover:scale-105"
                >
                  <div 
                    className="flex items-center gap-3 p-4 rounded-lg border border-racing-silver/20 hover:border-racing-red/50"
                  >
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.username} 
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-racing-red/10 flex items-center justify-center">
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <span className="text-racing-white block">{user.username}</span>
                      <span className="text-sm text-racing-silver">
                        {user.points || 0} pontos
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;
