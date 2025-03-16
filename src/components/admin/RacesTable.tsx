
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/date-utils";

interface RacesTableProps {
  races: any[];
  onEditRace: (race: any) => void;
}

export const RacesTable = ({ races, onEditRace }: RacesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-racing-silver/20">
          <TableHead className="text-racing-silver">Nome da Corrida</TableHead>
          <TableHead className="text-racing-silver">Data da Corrida</TableHead>
          <TableHead className="text-racing-silver">Data da Classificação</TableHead>
          <TableHead className="text-racing-silver w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {races && races.length > 0 ? (
          races.map((race) => (
            <TableRow key={race.id} className="border-racing-silver/20">
              <TableCell className="text-racing-white font-medium">{race.name}</TableCell>
              <TableCell className="text-racing-silver">{formatDate(race.date)}</TableCell>
              <TableCell className="text-racing-silver">{formatDate(race.qualifying_date)}</TableCell>
              <TableCell>
                <Button 
                  onClick={() => onEditRace(race)}
                  className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                  variant="outline"
                  size="sm"
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-racing-silver">
              Nenhuma corrida encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
