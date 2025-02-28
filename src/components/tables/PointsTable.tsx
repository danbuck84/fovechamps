
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
}

export const PointsTable = ({ 
  title, 
  data, 
  races, 
  getName, 
  getPoints, 
  ascending = false 
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
                  <th className="px-4 py-2 text-left sticky left-0 bg-racing-black text-racing-white">Nome</th>
                  {races.map((race) => (
                    <th key={race.id} className="px-4 py-2 text-center whitespace-nowrap text-racing-white">
                      {race.name}
                    </th>
                  ))}
                  <th className="px-4 py-2 text-center sticky right-0 bg-racing-black text-racing-white">Total</th>
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
                        <td className="px-4 py-2 sticky left-0 bg-racing-black text-racing-white">{getName(item)}</td>
                        {races.map((race) => (
                          <td key={race.id} className="px-4 py-2 text-center text-racing-white">
                            {getPoints(item, race.id) || "-"}
                          </td>
                        ))}
                        <td className="px-4 py-2 text-center font-bold sticky right-0 bg-racing-black text-racing-white">
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
