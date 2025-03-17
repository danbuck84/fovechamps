
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils/date-utils";
import { Clock, Trophy } from "lucide-react";

const PastPredictions = () => {
  const navigate = useNavigate();
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);

  // Buscar todas as corridas passadas
  const { data: pastRaces, isLoading: loadingRaces } = useQuery({
    queryKey: ["past-races"],
    queryFn: async () => {
      const now = new Date();
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .lt("qualifying_date", now.toISOString())
        .order("date", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Buscar previsões para a corrida selecionada
  const { data: predictions, isLoading: loadingPredictions } = useQuery({
    queryKey: ["race-predictions", selectedRaceId],
    queryFn: async () => {
      if (!selectedRaceId) return [];

      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          user:profiles(username, full_name)
        `)
        .eq("race_id", selectedRaceId);

      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedRaceId,
  });

  // Buscar resultados da corrida
  const { data: raceResult, isLoading: loadingResult } = useQuery({
    queryKey: ["race-result", selectedRaceId],
    queryFn: async () => {
      if (!selectedRaceId) return null;

      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", selectedRaceId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedRaceId,
  });

  // Buscar pilotos para mostrar nomes
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*");

      if (error) throw error;
      return data || [];
    },
  });

  // Função para obter o nome do piloto pelo ID
  const getDriverName = (driverId: string) => {
    if (!drivers) return "Carregando...";
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : "Piloto não encontrado";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-racing-white mb-8">Apostas Passadas</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-racing-black border-racing-silver/20 col-span-1">
          <CardHeader>
            <CardTitle className="text-xl text-racing-white">
              Corridas Passadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRaces ? (
              <p className="text-racing-silver">Carregando corridas...</p>
            ) : pastRaces && pastRaces.length > 0 ? (
              <div className="space-y-2">
                {pastRaces.map((race) => (
                  <div 
                    key={race.id}
                    onClick={() => setSelectedRaceId(race.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedRaceId === race.id 
                        ? "bg-racing-red/10 border border-racing-red" 
                        : "bg-racing-silver/5 border border-racing-silver/20 hover:bg-racing-silver/10"
                    }`}
                  >
                    <h3 className="font-semibold text-racing-white">{race.name}</h3>
                    <p className="text-sm text-racing-silver">{formatDate(race.date)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-racing-silver">Nenhuma corrida passada encontrada.</p>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {selectedRaceId ? (
            <>
              <Card className="bg-racing-black border-racing-silver/20 mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-racing-white">
                    Resultados Oficiais
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/race-results-view/${selectedRaceId}`)}
                    className="bg-racing-black text-racing-white border-racing-red hover:bg-racing-red/10"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingResult ? (
                    <p className="text-racing-silver">Carregando resultados...</p>
                  ) : raceResult ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-racing-red font-semibold mb-2">Pódio</h3>
                        {raceResult.race_results && raceResult.race_results.slice(0, 3).map((driverId, index) => (
                          <p key={`podium-${driverId}`} className="text-racing-white">
                            {index + 1}. {getDriverName(driverId)}
                          </p>
                        ))}
                      </div>
                      <div>
                        <h3 className="text-racing-red font-semibold mb-2">Pole Position</h3>
                        <p className="text-racing-white">
                          {raceResult.qualifying_results && raceResult.qualifying_results.length > 0 ? 
                            getDriverName(raceResult.qualifying_results[0]) : 
                            "Não disponível"}
                        </p>
                        <h3 className="text-racing-red font-semibold mt-2 mb-2">Volta Mais Rápida</h3>
                        <p className="text-racing-white">
                          {raceResult.fastest_lap ? 
                            getDriverName(raceResult.fastest_lap) : 
                            "Não disponível"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-racing-silver">Nenhum resultado disponível para esta corrida.</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-racing-black border-racing-silver/20">
                <CardHeader>
                  <CardTitle className="text-xl text-racing-white">
                    Apostas dos Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingPredictions ? (
                    <p className="text-racing-silver">Carregando apostas...</p>
                  ) : predictions && predictions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-racing-silver/20">
                          <TableHead className="text-racing-silver">Usuário</TableHead>
                          <TableHead className="text-racing-silver">Pole Position</TableHead>
                          <TableHead className="text-racing-silver">Volta Mais Rápida</TableHead>
                          <TableHead className="text-racing-silver">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {predictions.map((prediction) => (
                          <TableRow key={prediction.id} className="border-racing-silver/20">
                            <TableCell className="text-racing-white">
                              {prediction.user ? prediction.user.full_name || prediction.user.username : "Usuário"}
                            </TableCell>
                            <TableCell className="text-racing-silver">
                              {prediction.pole_position ? getDriverName(prediction.pole_position) : "N/A"}
                            </TableCell>
                            <TableCell className="text-racing-silver">
                              {prediction.fastest_lap ? getDriverName(prediction.fastest_lap) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                                onClick={() => navigate(`/race-predictions/${selectedRaceId}`)}
                              >
                                Ver Detalhes
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-racing-silver">Nenhuma aposta encontrada para esta corrida.</p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-racing-black border-racing-silver/20 h-full flex items-center justify-center">
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-racing-silver mx-auto mb-4" />
                <p className="text-racing-silver text-lg">
                  Selecione uma corrida para ver as apostas e resultados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastPredictions;
