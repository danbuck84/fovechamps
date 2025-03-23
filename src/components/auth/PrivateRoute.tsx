
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Auth error:", userError);
          throw userError;
        }
        
        if (!user) {
          console.log("No user found, redirecting to auth");
          navigate("/auth");
          return;
        }

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
        }
        
        if (profile) {
          setUsername(profile.username);
        }
        
        // Check if user is admin
        const { data: isUserAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (adminError) {
          console.error("Admin check error:", adminError);
        }
        
        setIsAdmin(!!isUserAdmin);
      } catch (error) {
        console.error("Error checking authentication:", error);
        toast.error("Erro ao verificar autenticação");
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate, location.pathname]);

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
