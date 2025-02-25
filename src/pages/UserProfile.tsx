
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/types/betting";

const UserProfile = () => {
  const { userId } = useParams();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
  });

  const { data: predictions } = useQuery({
    queryKey: ["user-predictions", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          race:races(
            name,
            date
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-racing-black border-racing-silver/20 mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.username} 
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-racing-red/10 flex items-center justify-center text-2xl">
                  {profile.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <CardTitle className="text-2xl">{profile.username}</CardTitle>
                <p className="text-racing-silver mt-2">
                  {profile.points || 0} pontos no total
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Histórico de Apostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictions?.map((prediction: any) => (
                <div 
                  key={prediction.id}
                  className="p-4 border border-racing-silver/20 rounded-lg"
                >
                  <h3 className="font-semibold text-lg mb-2">{prediction.race.name}</h3>
                  <p className="text-racing-silver">
                    Data: {new Date(prediction.race.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
