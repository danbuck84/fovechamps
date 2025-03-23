
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import MainLayout from "@/components/layout/MainLayout";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Fetch profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
        
        // Check if user is admin
        const { data: isUserAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
        setIsAdmin(!!isUserAdmin);
      } catch (error) {
        console.error("Error checking authentication:", error);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-racing-silver">Carregando...</p>
      </div>
    );
  }

  return (
    <MainLayout username={username} isAdmin={isAdmin}>
      {children}
    </MainLayout>
  );
}
