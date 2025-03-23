
import { useDashboardData } from "@/hooks/useDashboardData";
import { UpcomingRacesCard } from "@/components/dashboard/UpcomingRacesCard";
import { PastRacesCard } from "@/components/dashboard/PastRacesCard";
import { RecentPredictionsCard } from "@/components/dashboard/RecentPredictionsCard";
import { StatsCard } from "@/components/dashboard/StatsCard";

const Dashboard = () => {
  const { nextRaces, pastRaces, recentPredictions, hasResults, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <div className="p-6 text-racing-silver">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="p-6">
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
