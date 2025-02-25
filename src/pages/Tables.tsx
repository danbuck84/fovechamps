
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Race, Driver, Team, Profile } from "@/types/betting";

interface DriverPoints {
  driver_id: string;
  race_id: string;
  points: number;
  driver: Driver;
}

interface ConstructorPoints {
  team_id: string;
  race_id: string;
  points: number;
  team: Team;
}

interface GamePoints {
  user_id: string;
  race_id: string;
  game_type: string;
  points: number;
  profile: Profile;
}

const Tables = () => {
  // Buscar todas as corridas para usar como colunas
  const { data: races } = useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });
      
      if (error) throw error;
      return data as Race[];
    },
  });

  // Buscar pontos dos pilotos
  const { data: driverPoints } = useQuery({
    queryKey: ["driver-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_race_points")
        .select(`
          driver_id,
          race_id,
          points,
          driver:drivers(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as DriverPoints[];
    },
  });

  // Buscar pontos dos construtores
  const { data: constructorPoints } = useQuery({
    queryKey: ["constructor-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("constructor_race_points")
        .select(`
          team_id,
          race_id,
          points,
          team:teams(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as ConstructorPoints[];
    },
  });

  // Buscar pontos dos jogos
  const { data: gamePoints } = useQuery({
    queryKey: ["game-points"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("game_points")
        .select(`
          user_id,
          race_id,
          game_type,
          points,
          profile:profiles(*)
        `)
        .order("points", { ascending: false });
      
      if (error) throw error;
      return data as GamePoints[];
    },
  });

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

  const renderPointsTable = (title: string, data: any[], getName: (item: any) => string, getPoints: (item: any, raceId: string) => number, ascending: boolean = false) => (
    <Card className="bg-racing-black border-racing-silver/20 mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-racing-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <table className="w-full">
              <thead>
                <tr className="border-b border-racing-silver/20">
                  <th className="px-4 py-2 text-left sticky left-0 bg-racing-black">Nome</th>
                  {races.map((race) => (
                    <th key={race.id} className="px-4 py-2 text-center whitespace-nowrap">
                      {race.name}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-center sticky right-0 bg-racing-black">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...data]
                  .sort((a, b) => {
                    const totalA = races.reduce((sum, race) => sum + getPoints(a, race.id), 0);
                    const totalB = races.reduce((sum, race) => sum + getPoints(b, race.id), 0);
                    return ascending ? totalA - totalB : totalB - totalA;
                  })
                  .map((item) => {
                    const total = races.reduce((sum, race) => sum + getPoints(item, race.id), 0);
                    return (
                      <tr key={item.id} className="border-b border-racing-silver/20">
                        <td className="px-4 py-2 sticky left-0 bg-racing-black">{getName(item)}</td>
                        {races.map((race) => (
                          <td key={race.id} className="px-4 py-2 text-center">
                            {getPoints(item, race.id) || "-"}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center font-bold sticky right-0 bg-racing-black">
                          {total}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  const groupDriverPoints = driverPoints.reduce((acc, point) => {
    if (!acc[point.driver_id]) {
      acc[point.driver_id] = {
        id: point.driver_id,
        driver: point.driver,
        points: {},
      };
    }
    acc[point.driver_id].points[point.race_id] = point.points;
    return acc;
  }, {} as Record<string, any>);

  const groupConstructorPoints = constructorPoints.reduce((acc, point) => {
    if (!acc[point.team_id]) {
      acc[point.team_id] = {
        id: point.team_id,
        team: point.team,
        points: {},
      };
    }
    acc[point.team_id].points[point.race_id] = point.points;
    return acc;
  }, {} as Record<string, any>);

  const groupGamePoints = (gameType: string) => {
    return gamePoints
      .filter((point) => point.game_type === gameType)
      .reduce((acc, point) => {
        if (!acc[point.user_id]) {
          acc[point.user_id] = {
            id: point.user_id,
            profile: point.profile,
            points: {},
          };
        }
        acc[point.user_id].points[point.race_id] = point.points;
        return acc;
      }, {} as Record<string, any>);
  };

  return (
    <div className="min-h-screen bg-racing-black text-racing-white p-8">
      {renderPointsTable(
        "Campeonato de Pilotos",
        Object.values(groupDriverPoints),
        (item: any) => item.driver.name,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}

      {renderPointsTable(
        "Campeonato de Construtores",
        Object.values(groupConstructorPoints),
        (item: any) => item.team.name,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}

      {renderPointsTable(
        "Tempo da Pole",
        Object.values(groupGamePoints("pole_time")),
        (item: any) => item.profile.username,
        (item: any, raceId: string) => item.points[raceId] || 0,
        true // Ordenar do menor para o maior
      )}

      {renderPointsTable(
        "Acerte o Grid",
        Object.values(groupGamePoints("grid")),
        (item: any) => item.profile.username,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}

      {renderPointsTable(
        "Palpites",
        Object.values(groupGamePoints("predictions")),
        (item: any) => item.profile.username,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}

      {renderPointsTable(
        "Sobreviventes",
        Object.values(groupGamePoints("survivors")),
        (item: any) => item.profile.username,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}

      {renderPointsTable(
        "Companheiros de Equipe",
        Object.values(groupGamePoints("teammates")),
        (item: any) => item.profile.username,
        (item: any, raceId: string) => item.points[raceId] || 0
      )}
    </div>
  );
};

export default Tables;
