
import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UpcomingRacesCard } from "@/components/dashboard/UpcomingRacesCard";
import { PastRacesCard } from "@/components/dashboard/PastRacesCard";
import { RecentPredictionsCard } from "@/components/dashboard/RecentPredictionsCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { nextRaces, pastRaces, recentPredictions, hasResults, isLoading } = useDashboardData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Dashboard: Checking authentication");
      try {
        const { data } = await supabase.auth.getUser();
        console.log("Dashboard: Auth check result:", data.user ? "User found" : "No user");
        setIsAuthenticated(!!data.user);
      } catch (error) {
        console.error("Dashboard: Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  console.log("Dashboard: Rendering", {
    isLoading,
    authChecked,
    isAuthenticated,
    nextRaces: nextRaces?.length || 0,
    pastRaces: pastRaces?.length || 0,
    recentPredictions: recentPredictions?.length || 0
  });

  if (!authChecked) {
    return (
      <div className="p-6 text-racing-silver">
        Verificando autenticação...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-racing-silver">
        Usuário não autenticado. Por favor, faça login novamente.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 text-racing-silver">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 w-full min-h-screen">
      <h1 className="text-3xl font-bold text-racing-white mb-6">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UpcomingRacesCard races={nextRaces} hasResults={hasResults} />
        <PastRacesCard races={pastRaces} hasResults={hasResults} />
        <RecentPredictionsCard predictions={recentPredictions} />
        <StatsCard />
      </div>
    </div>
  );
};

export default Dashboard;
