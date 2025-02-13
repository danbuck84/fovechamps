
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Race, Driver, Prediction } from "@/types/betting";

const MyPredictions = () => {
  const navigate = useNavigate();

  const { data: predictions, isLoading } = useQuery({
    queryKey: ["my-predictions"],
    queryFn: async () => {
      const { data: predictionsData, error: predictionsError } = await supabase
        .from("predictions")
        .select(`
          *,
          race:races (
            name,
            date,
            qualifying_date
          )
        `)
        .order('created_at', { ascending: false });

      if (predictionsError) throw predictionsError;

      const { data: driversData, error: driversError } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name
          )
        `);

      if (driversError) throw driversError;

      return {
        predictions: predictionsData as (Prediction & { 
          race: Pick<Race, 'name' | 'date' | 'qualifying_date'>
        })[],
        drivers: driversData as (Driver & { team: { name: string } })[]
      };
    },
  });

  const formatDate = (date: string) => {
    return formatInTimeZone(
      new Date(date),
      'America/Sao_Paulo',
      "d 'de' MMMM 'às' HH:mm",
      { locale: ptBR }
    );
  };

  const getDriverName = (driverId: string) => {
    const driver = predictions?.drivers.find(d => d.id === driverId);
    return driver ? `${driver.name} (${driver.team.name})` : 'Piloto não encontrado';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando suas apostas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="text-racing-silver hover:text-racing-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <h1 className="text-3xl font-bold mb-8">Minhas Apostas</h1>

        <div className="space-y-8">
          {predictions?.predictions.map((prediction) => (
            <Card key={prediction.id} className="bg-racing-black border-racing-silver/20">
              <CardHeader>
                <CardTitle className="text-2xl text-racing-white">
                  {prediction.race.name}
                </CardTitle>
                <div className="text-racing-silver">
                  <p>Data da corrida: {formatDate(prediction.race.date)}</p>
                  <p>Classificação: {formatDate(prediction.race.qualifying_date)}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Classificação</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-racing-silver">Pole Position:</p>
                      <p className="text-racing-white">{getDriverName(prediction.pole_position)}</p>
                    </div>
                    {prediction.pole_time && (
                      <div>
                        <p className="text-racing-silver">Tempo da Pole:</p>
                        <p className="text-racing-white">{prediction.pole_time}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Grid de Largada Previsto</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-racing-silver/20">
                        <TableHead className="text-racing-silver">Posição</TableHead>
                        <TableHead className="text-racing-silver">Piloto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prediction.qualifying_top_10.map((driverId, index) => (
                        <TableRow key={`qual-${index}`} className="border-racing-silver/20">
                          <TableCell className="text-racing-silver">{index + 1}º</TableCell>
                          <TableCell className="text-racing-white">
                            {getDriverName(driverId)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Resultado da Corrida Previsto</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-racing-silver/20">
                        <TableHead className="text-racing-silver">Posição</TableHead>
                        <TableHead className="text-racing-silver">Piloto</TableHead>
                        <TableHead className="text-racing-silver">DNF</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prediction.top_10.map((driverId, index) => (
                        <TableRow key={`race-${index}`} className="border-racing-silver/20">
                          <TableCell className="text-racing-silver">{index + 1}º</TableCell>
                          <TableCell className="text-racing-white">
                            {getDriverName(driverId)}
                          </TableCell>
                          <TableCell className="text-racing-white">
                            {prediction.dnf_predictions.includes(driverId) ? 'Sim' : 'Não'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {prediction.fastest_lap && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Volta Mais Rápida</h3>
                    <p className="text-racing-white">{getDriverName(prediction.fastest_lap)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPredictions;
