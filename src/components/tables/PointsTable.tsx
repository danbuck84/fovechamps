
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Race } from "@/types/betting";
import type { GroupedPoints } from "@/types/tables";

interface PointsTableProps {
  title: string;
  data: GroupedPoints[];
  races: Race[];
  getName: (item: any) => string;
  getPoints: (item: any, raceId: string) => number;
  ascending?: boolean;
  isDrivers?: boolean;
  getTeam?: (item: any) => string;
  getNationality?: (item: any) => string;
}

export const PointsTable = ({ 
  title, 
  data, 
  races, 
  getName, 
  getPoints, 
  ascending = false,
  isDrivers = false,
  getTeam,
  getNationality
}: PointsTableProps) => {
  return (
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
                  <th className="px-4 py-2 text-left sticky left-0 bg-racing-black text-racing-white">POS</th>
                  {isDrivers ? (
                    <>
                      <th className="px-4 py-2 text-left text-racing-white">Piloto</th>
                      <th className="px-4 py-2 text-center text-racing-white">Nacionalidade</th>
                      <th className="px-4 py-2 text-left text-racing-white">Equipe</th>
                    </>
                  ) : (
                    <th className="px-4 py-2 text-left text-racing-white">Equipe</th>
                  )}
                  <th className="px-4 py-2 text-center text-racing-white">Pts</th>
                </tr>
              </thead>
              <tbody>
                {[...data]
                  .sort((a, b) => {
                    const totalA = races.reduce((sum, race) => sum + getPoints(a, race.id), 0);
                    const totalB = races.reduce((sum, race) => sum + getPoints(b, race.id), 0);
                    return ascending ? totalA - totalB : totalB - totalA;
                  })
                  .map((item, index) => {
                    const total = races.reduce((sum, race) => sum + getPoints(item, race.id), 0);
                    return (
                      <tr key={item.id} className="border-b border-racing-silver/20">
                        <td className="px-4 py-2 sticky left-0 bg-racing-black text-racing-white">{index + 1}</td>
                        {isDrivers ? (
                          <>
                            <td className="px-4 py-2 text-racing-white">{getName(item)}</td>
                            <td className="px-4 py-2 text-center text-racing-white">{getNationality && getNationality(item)}</td>
                            <td className="px-4 py-2 text-racing-white">{getTeam && getTeam(item)}</td>
                          </>
                        ) : (
                          <td className="px-4 py-2 text-racing-white">{getName(item)}</td>
                        )}
                        <td className="px-4 py-2 text-center font-bold text-racing-white">
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
};
