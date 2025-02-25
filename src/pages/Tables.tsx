
import { useTableData } from "@/hooks/useTableData";
import { PointsTable } from "@/components/tables/PointsTable";
import { groupDriverPoints, groupConstructorPoints, groupGamePoints } from "@/utils/points-utils";

const Tables = () => {
  const { races, driverPoints, constructorPoints, gamePoints } = useTableData();

  // Log para debug
  console.log("Driver Points:", driverPoints);
  console.log("Constructor Points:", constructorPoints);
  console.log("Game Points:", gamePoints);

  if (!races || !driverPoints || !constructorPoints || !gamePoints) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white p-8">
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white p-8">
      <PointsTable
        title="Campeonato de Pilotos"
        data={Object.values(groupDriverPoints(driverPoints))}
        races={races}
        getName={(item) => item.driver.name}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />

      <PointsTable
        title="Campeonato de Construtores"
        data={Object.values(groupConstructorPoints(constructorPoints))}
        races={races}
        getName={(item) => item.team.name}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />

      <PointsTable
        title="Tempo da Pole"
        data={Object.values(groupGamePoints(gamePoints, "pole_time"))}
        races={races}
        getName={(item) => item.profile.username}
        getPoints={(item, raceId) => item.points[raceId] || 0}
        ascending={true}
      />

      <PointsTable
        title="Acerte o Grid"
        data={Object.values(groupGamePoints(gamePoints, "grid"))}
        races={races}
        getName={(item) => item.profile.username}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />

      <PointsTable
        title="Palpites"
        data={Object.values(groupGamePoints(gamePoints, "predictions"))}
        races={races}
        getName={(item) => item.profile.username}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />

      <PointsTable
        title="Sobreviventes"
        data={Object.values(groupGamePoints(gamePoints, "survivors"))}
        races={races}
        getName={(item) => item.profile.username}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />

      <PointsTable
        title="Companheiros de Equipe"
        data={Object.values(groupGamePoints(gamePoints, "teammates"))}
        races={races}
        getName={(item) => item.profile.username}
        getPoints={(item, raceId) => item.points[raceId] || 0}
      />
    </div>
  );
};

export default Tables;
