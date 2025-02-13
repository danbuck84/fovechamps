import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { Race, Driver } from "@/types/betting";

const RacePredictions = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [polePosition, setPolePosition] = useState("");
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(10).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(10).fill(""));
  const [dnfPredictions, setDnfPredictions] = useState<string[]>([]);

  const { data: race, isLoading: isLoadingRace } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();

      if (error) throw error;
      return data as Race;
    },
  });

  const { data: drivers, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `)
        .order('name');

      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
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

  const handleDriverDNF = (driverId: string) => {
    setDnfPredictions(prev => {
      if (prev.includes(driverId)) {
        return prev.filter(id => id !== driverId);
      }
      return [...prev, driverId];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer palpites",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("predictions").insert({
      race_id: raceId,
      user_id: user.data.user.id,
      pole_position: polePosition,
      pole_time: poleTime,
      fastest_lap: fastestLap,
      qualifying_top_10: qualifyingTop10,
      top_10: raceTop10,
      dnf_predictions: dnfPredictions,
    });

    if (error) {
      toast({
        title: "Erro ao salvar palpites",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Palpites salvos com sucesso!",
      description: "Boa sorte!",
    });

    navigate("/");
  };

  if (isLoadingRace || isLoadingDrivers || !race || !drivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando informações...</p>
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

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-2xl text-racing-white">
              {race.name}
            </CardTitle>
            <p className="text-racing-silver">
              Data da corrida: {formatDate(race.date)}
            </p>
            <p className="text-racing-silver">
              Classificação: {formatDate(race.qualifying_date)}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Pole Position Prediction */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Classificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-racing-silver">
                      Pole Position
                    </label>
                    <Select value={polePosition} onValueChange={setPolePosition}>
                      <SelectTrigger className="bg-racing-black border-racing-silver/20">
                        <SelectValue placeholder="Selecione um piloto" />
                      </SelectTrigger>
                      <SelectContent>
                        {drivers.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} ({driver.team.name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="poleTime" className="text-sm text-racing-silver">
                      Tempo da Pole (formato: 1:23.456)
                    </label>
                    <Input
                      id="poleTime"
                      value={poleTime}
                      onChange={(e) => setPoleTime(e.target.value)}
                      className="bg-racing-black border-racing-silver/20"
                      placeholder="1:23.456"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Qualifying Top 10 Prediction */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Acerte o Grid</h3>
                  <p className="text-sm text-racing-silver">
                    Tente acertar exatamente a posição de cada piloto no grid de largada após a classificação.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {qualifyingTop10.map((_, index) => (
                    <div key={`qual-${index}`} className="space-y-2">
                      <label className="text-sm text-racing-silver">
                        {index + 1}º Lugar
                      </label>
                      <Select
                        value={qualifyingTop10[index]}
                        onValueChange={(value) => {
                          const newTop10 = [...qualifyingTop10];
                          newTop10[index] = value;
                          setQualifyingTop10(newTop10);
                        }}
                      >
                        <SelectTrigger className="bg-racing-black border-racing-silver/20">
                          <SelectValue placeholder="Selecione um piloto" />
                        </SelectTrigger>
                        <SelectContent>
                          {drivers.map((driver) => (
                            <SelectItem key={driver.id} value={driver.id}>
                              {driver.name} ({driver.team.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Race Top 10 Predictions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Palpites da Corrida</h3>
                  <p className="text-sm text-racing-silver">
                    Faça seus palpites para o resultado final da corrida, prevendo as 10 primeiras posições.
                    Marque o checkbox ao lado do piloto caso você ache que ele não completará a prova (DNF).
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {raceTop10.map((_, index) => (
                    <div key={`race-${index}`} className="space-y-2">
                      <label className="text-sm text-racing-silver">
                        {index + 1}º Lugar
                      </label>
                      <div className="flex gap-2 items-center">
                        <Select
                          value={raceTop10[index]}
                          onValueChange={(value) => {
                            const newTop10 = [...raceTop10];
                            newTop10[index] = value;
                            setRaceTop10(newTop10);
                          }}
                          className="flex-1"
                        >
                          <SelectTrigger className="bg-racing-black border-racing-silver/20">
                            <SelectValue placeholder="Selecione um piloto" />
                          </SelectTrigger>
                          <SelectContent>
                            {drivers.map((driver) => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name} ({driver.team.name})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {raceTop10[index] && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`dnf-${raceTop10[index]}`}
                              checked={dnfPredictions.includes(raceTop10[index])}
                              onCheckedChange={() => handleDriverDNF(raceTop10[index])}
                            />
                            <label
                              htmlFor={`dnf-${raceTop10[index]}`}
                              className="text-sm text-racing-silver"
                            >
                              DNF
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-racing-red hover:bg-opacity-90"
              >
                Salvar Palpites
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
