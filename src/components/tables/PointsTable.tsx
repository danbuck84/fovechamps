
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
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
    <Card className="bg-racing-black border-racing-silver/20 mb-8 w-full">
      <CardHeader className="px-6">
        <CardTitle className="text-xl text-racing-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <ScrollArea className="w-full">
          <div className="min-w-max">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-racing-silver/20">
                  <TableHead className="w-16 text-left bg-racing-black text-racing-white font-semibold">POS</TableHead>
                  {isDrivers ? (
                    <>
                      <TableHead className="text-left text-racing-white font-semibold">Piloto</TableHead>
                      <TableHead className="text-center text-racing-white font-semibold">Nacionalidade</TableHead>
                      <TableHead className="text-left text-racing-white font-semibold">Equipe</TableHead>
                    </>
                  ) : (
                    <TableHead className="text-left text-racing-white font-semibold">Equipe</TableHead>
                  )}
                  <TableHead className="text-center text-racing-white font-semibold">Pts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...data]
                  .sort((a, b) => {
                    const totalA = races.reduce((sum, race) => sum + getPoints(a, race.id), 0);
                    const totalB = races.reduce((sum, race) => sum + getPoints(b, race.id), 0);
                    return ascending ? totalA - totalB : totalB - totalA;
                  })
                  .map((item, index) => {
                    const total = races.reduce((sum, race) => sum + getPoints(item, race.id), 0);
                    return (
                      <TableRow key={item.id} className="border-b border-racing-silver/20">
                        <TableCell className="bg-racing-black text-racing-white font-medium">{index + 1}</TableCell>
                        {isDrivers ? (
                          <>
                            <TableCell className="text-racing-white">{getName(item)}</TableCell>
                            <TableCell className="text-center text-racing-white">{getNationality && getNationality(item)}</TableCell>
                            <TableCell className="text-racing-white">{getTeam && getTeam(item)}</TableCell>
                          </>
                        ) : (
                          <TableCell className="text-racing-white">{getName(item)}</TableCell>
                        )}
                        <TableCell className="text-center font-bold text-racing-white">
                          {total}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
