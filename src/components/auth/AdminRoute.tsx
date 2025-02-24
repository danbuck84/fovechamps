
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-racing-black flex items-center justify-center">
        <p className="text-racing-silver">Verificando permissões...</p>
      </div>
    );
  }

  return isAdmin ? children : null;
}
