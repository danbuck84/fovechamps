
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
      }
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen bg-racing-black flex items-center justify-center">
      <p className="text-racing-silver">Carregando...</p>
    </div>;
  }

  return children;
};
