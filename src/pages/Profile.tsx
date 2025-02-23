
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@/types/user";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate("/auth");
          return;
        }

        setUser(user);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setFullName(profile.full_name || "");
        setUsername(profile.username || "");
        setAvatarUrl(profile.avatar_url || "");
      } catch (error: any) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [navigate]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar o perfil: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-racing-silver">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black p-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-racing-white">Meu Perfil</CardTitle>
            <CardDescription className="text-racing-silver">
              Gerencie suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-racing-silver">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="mt-1 bg-racing-black/50 border-racing-silver/20 text-racing-silver"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-racing-silver">
                    Nome Completo
                  </label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 bg-racing-black border-racing-silver/20 text-racing-white focus:ring-racing-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-racing-silver">
                    Nome de Usuário
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 bg-racing-black border-racing-silver/20 text-racing-white focus:ring-racing-red"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-racing-silver">
                    URL do Avatar
                  </label>
                  <Input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="mt-1 bg-racing-black border-racing-silver/20 text-racing-white focus:ring-racing-red"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-racing-red hover:bg-racing-red/90 text-white"
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  onClick={handleSignOut}
                  variant="outline"
                  className="flex-1 border-racing-silver/20 text-racing-silver hover:bg-racing-red hover:text-white"
                >
                  Sair
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
