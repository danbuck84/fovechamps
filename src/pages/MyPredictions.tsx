import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowLeft, ChevronDown, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Race, Driver, Prediction } from "@/types/betting";
import { Link } from "react-router-dom";

const MyPredictions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: predictions, isLoading, refetch } = useQuery({
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

  const handleDelete = async (predictionId: string) => {
    try {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', predictionId)
        .single();

      if (error) {
        console.error('Erro ao apagar aposta:', error);
        toast({
          title: "Erro ao apagar aposta",
          description: "Não foi possível apagar sua aposta. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Aposta apagada",
        description: "Sua aposta foi apagada com sucesso.",
      });

      await refetch();
    } catch (error) {
      console.error('Erro ao apagar aposta:', error);
      toast({
        title: "Erro ao apagar aposta",
        description: "Não foi possível apagar sua aposta. Tente novamente.",
        variant: "destructive",
      });
    }
  };

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

        <div className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {predictions?.predictions.map((prediction) => (
              <AccordionItem 
                key={prediction.id} 
                value={prediction.id}
                className="border-racing-silver/20 px-0 data-[state=open]:border-racing-red"
              >
                <Card className="bg-racing-black border-racing-silver/20 hover:border-racing-red transition-colors duration-200 data-[state=open]:border-racing-red">
                  <div className="flex justify-between items-start p-6">
                    <AccordionTrigger className="w-full hover:no-underline [&[data-state=open]>div]:border-racing-red">
                      <CardHeader className="w-full border-b border-transparent p-0">
                        <div className="flex items-center justify-between w-full">
                          <CardTitle className="text-2xl text-racing-white">
                            {prediction.race.name}
                          </CardTitle>
                          <ChevronDown className="h-6 w-6 text-racing-silver shrink-0 transition-transform duration-200" />
                        </div>
                        <div className="text-racing-silver text-left">
                          <p>Data da corrida: {formatDate(prediction.race.date)}</p>
                          <p>Classificação: {formatDate(prediction.race.qualifying_date)}</p>
                        </div>
                      </CardHeader>
                    </AccordionTrigger>
                    <div className="flex gap-2 ml-4">
                      <Link
                        to={`/race-predictions/${prediction.race_id}`}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-red hover:text-racing-white"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-red hover:text-racing-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(prediction.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent>
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
                        <div className="mb-2 text-sm text-racing-silver">
                          Sua previsão para o resultado da classificação:
                        </div>
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
                        <h3 className="text-xl font-semibold mb-4">Grid de Chegada Previsto</h3>
                        <div className="mb-2 text-sm text-racing-silver">
                          Sua previsão para o resultado final da corrida:
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-racing-silver/20">
                              <TableHead className="text-racing-silver">Posição</TableHead>
                              <TableHead className="text-racing-silver">Piloto</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prediction.top_10.map((driverId, index) => (
                              <TableRow key={`race-${index}`} className="border-racing-silver/20">
                                <TableCell className="text-racing-silver">{index + 1}º</TableCell>
                                <TableCell className="text-racing-white">
                                  {getDriverName(driverId)}
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

                      <div>
                        <h3 className="text-xl font-semibold mb-2">Abandonos Previstos</h3>
                        <p className="text-racing-silver">
                          Você previu {prediction.dnf_predictions.length} abandono(s) nesta corrida
                        </p>
                      </div>
                    </CardContent>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default MyPredictions;
