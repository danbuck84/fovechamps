
import { useTeamDetail } from "@/hooks/team/useTeamDetail";
import { useTeamStats } from "@/hooks/team/useTeamStats";
import MainLayout from "@/components/layout/MainLayout";
import LoadingState from "@/components/common/LoadingState";
import NotFoundTeam from "@/components/team/NotFoundTeam";
import TeamHeader from "@/components/team/TeamHeader";
import TeamInfo from "@/components/team/TeamInfo";
import TeamStats from "@/components/team/TeamStats";
import TeamDriversList from "@/components/team/TeamDriversList";

const TeamDetail = () => {
  const { team, isLoading } = useTeamDetail();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!team) {
    return <NotFoundTeam />;
  }

  const stats = useTeamStats(team.name);

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-4xl mx-auto">
          <TeamHeader teamName={team.name} fullName={stats.fullName} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TeamInfo 
              base={stats.base}
              teamChief={stats.teamChief}
              techChief={stats.techChief}
              chassis={stats.chassis}
              engine={team.engine}
              firstEntry={stats.firstEntry}
            />

            <TeamStats 
              championships={stats.championships}
              poles={stats.poles}
              fastestLaps={stats.fastestLaps}
              highestFinish={stats.highestFinish}
            />
          </div>
          
          <TeamDriversList drivers={team.drivers} />
        </div>
      </div>
    </MainLayout>
  );
};

export default TeamDetail;
