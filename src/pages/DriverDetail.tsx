
import { Card, CardContent } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import LoadingState from "@/components/common/LoadingState";
import NotFoundDriver from "@/components/driver/NotFoundDriver";
import DriverHeader from "@/components/driver/DriverHeader";
import DriverPersonalInfo from "@/components/driver/DriverPersonalInfo";
import DriverTeamInfo from "@/components/driver/DriverTeamInfo";
import DriverStats from "@/components/driver/DriverStats";
import { useDriverDetail } from "@/hooks/driver/useDriverDetail";
import { getDriverStats } from "@/utils/driver-stats";

const DriverDetail = () => {
  const { driver, isLoading } = useDriverDetail();
  
  if (isLoading) {
    return <LoadingState message="Carregando..." />;
  }
  
  if (!driver) {
    return <NotFoundDriver />;
  }

  const stats = getDriverStats(driver.name);

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-4xl mx-auto">
          <DriverHeader 
            name={driver.name} 
            number={driver.number} 
            country={stats.country} 
          />

          <Card className="bg-racing-black border-racing-silver/20 mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <DriverPersonalInfo stats={stats} />
                  <DriverTeamInfo team={driver.team} />
                </div>

                <div>
                  <DriverStats stats={stats} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DriverDetail;
