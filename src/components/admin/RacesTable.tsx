
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/date-utils";
import { BadgeCheck, BadgeX, Trash2 } from "lucide-react";

interface RacesTableProps {
  races: any[];
  onEditRace: (race: any) => void;
  onDeleteRace: (raceId: string) => void;
}

export const RacesTable = ({ races, onEditRace, onDeleteRace }: RacesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-racing-silver/20">
          <TableHead className="text-racing-silver">Nome da Corrida</TableHead>
          <TableHead className="text-racing-silver">Data da Corrida</TableHead>
          <TableHead className="text-racing-silver">Data da Classificação</TableHead>
          <TableHead className="text-racing-silver">Válida</TableHead>
          <TableHead className="text-racing-silver w-[150px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {races && races.length > 0 ? (
          races.map((race) => (
            <TableRow key={race.id} className="border-racing-silver/20">
              <TableCell className="text-racing-white font-medium">{race.name}</TableCell>
              <TableCell className="text-racing-silver">{formatDate(race.date)}</TableCell>
              <TableCell className="text-racing-silver">{formatDate(race.qualifying_date)}</TableCell>
              <TableCell className="text-racing-silver">
                {race.is_valid !== false ? (
                  <BadgeCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <BadgeX className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onEditRace(race)}
                    className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                    variant="outline"
                    size="sm"
                  >
                    Editar
                  </Button>
                  <Button 
                    onClick={() => onDeleteRace(race.id)}
                    className="bg-transparent border-racing-red text-racing-red hover:bg-racing-red/10"
                    variant="outline"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-racing-silver">
              Nenhuma corrida encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
