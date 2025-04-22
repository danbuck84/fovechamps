
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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  
  // Display a message if no data is available
  if (!data || data.length === 0) {
    return (
      <Card className="bg-racing-black border-racing-silver/20 mb-8 w-full mx-auto">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-xl text-racing-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6 py-6">
          <p className="text-racing-silver text-center">Nenhum dado disponível para esta temporada.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-racing-black border-racing-silver/20 mb-8 w-full mx-auto">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-xl text-racing-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ScrollArea className="w-full" type="always">
          <div className={`min-w-max ${isMobile ? 'pb-4' : ''}`}>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-racing-silver/20">
                  <TableHead className="w-12 md:w-16 text-center bg-racing-black text-racing-white font-semibold sticky left-0 z-10">POS</TableHead>
                  {isDrivers ? (
                    <>
                      <TableHead className="text-left text-racing-white font-semibold sticky left-12 md:left-16 bg-racing-black z-10 min-w-[120px]">Piloto</TableHead>
                      {!isMobile && <TableHead className="text-center text-racing-white font-semibold">Nacionalidade</TableHead>}
                      <TableHead className="text-left text-racing-white font-semibold min-w-[100px]">Equipe</TableHead>
                    </>
                  ) : (
                    <TableHead className="text-left text-racing-white font-semibold sticky left-12 md:left-16 bg-racing-black z-10 min-w-[150px]">Equipe</TableHead>
                  )}
                  <TableHead className="text-center text-racing-white font-semibold w-16">Pts</TableHead>
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
                    
                    // Apply special styling for swapped drivers
                    const isSwappedDriver = item.name === "Yuki Tsunoda" || item.name === "Liam Lawson";
                    const displayTeam = (getTeam && getTeam(item)) || "";
                    
                    return (
                      <TableRow key={item.id} className="border-b border-racing-silver/20">
                        <TableCell className="bg-racing-black text-racing-white font-medium text-center sticky left-0 z-10">{index + 1}</TableCell>
                        {isDrivers ? (
                          <>
                            <TableCell className="text-racing-white sticky left-12 md:left-16 bg-racing-black z-10">{getName(item)}</TableCell>
                            {!isMobile && <TableCell className="text-center text-racing-white">{getNationality && getNationality(item)}</TableCell>}
                            <TableCell className={`text-racing-white ${isSwappedDriver ? "font-medium" : ""}`}>
                              {displayTeam}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="text-racing-white sticky left-12 md:left-16 bg-racing-black z-10">{getName(item)}</TableCell>
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
