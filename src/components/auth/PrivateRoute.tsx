
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, debugSupabase } from "@/lib/supabase";
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
        console.log("PrivateRoute: Checking authentication...");
        setLoading(true);
        
        // Run debug utility to check Supabase connection
        const hasSession = debugSupabase();
        
        if (!hasSession) {
          console.log("PrivateRoute: No session found in localStorage");
        }
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log("PrivateRoute: Auth check result:", user ? "User found" : "No user", userError ? `Error: ${userError.message}` : "No error");
        
        if (userError) {
          console.error("PrivateRoute: Auth error:", userError);
          throw userError;
        }
        
        if (!user) {
          console.log("PrivateRoute: No user found, redirecting to auth");
          navigate("/auth", { replace: true });
          return;
        }

        console.log("PrivateRoute: User authenticated", user.id);

        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profileError) {
          console.error("PrivateRoute: Profile error:", profileError);
        }
        
        if (profile) {
          console.log("PrivateRoute: Profile found", profile.username);
          setUsername(profile.username);
        } else {
          console.log("PrivateRoute: No profile found for user", user.id);
        }
        
        // Check if user is admin
        const { data: isUserAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
        
        if (adminError) {
          console.error("PrivateRoute: Admin check error:", adminError);
        }
        
        setIsAdmin(!!isUserAdmin);
        console.log("PrivateRoute: Admin status:", !!isUserAdmin);
        
      } catch (error) {
        console.error("PrivateRoute: Error checking authentication:", error);
        toast.error("Erro ao verificar autenticação");
        navigate("/auth", { replace: true });
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

  // Passamos username e isAdmin como props para o componente filho através de clonagem
  return React.cloneElement(children as React.ReactElement, { username, isAdmin });
}
