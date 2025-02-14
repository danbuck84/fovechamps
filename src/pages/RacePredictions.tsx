
import { useState, useEffect } from "react";
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

  // Effect to update qualifying grid when pole position changes
  useEffect(() => {
    if (polePosition) {
      setQualifyingTop10(prev => {
        const newTop10 = [...prev];
        newTop10[0] = polePosition;
        return newTop10;
      });
    }
  }, [polePosition]);

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

    navigate("/my-predictions");
  };

  const formatPoleTime = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    const limited = numbers.slice(0, 6);
    if (limited.length < 6) return limited;
    const minutes = parseInt(limited[0]);
    const seconds = parseInt(limited[1] + limited[2]);
    if (seconds > 59) {
      toast({
        title: "Tempo inválido",
        description: "Os segundos não podem ser maiores que 59",
        variant: "destructive",
      });
      return "";
    }
    return `${minutes}:${limited[1]}${limited[2]}.${limited[3]}${limited[4]}${limited[5]}`;
  };

  const handlePoleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPoleTime(e.target.value);
    setPoleTime(formatted);
  };

  // Get available drivers for a specific position (excluding already selected drivers)
  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    
    return drivers.filter(driver => {
      // For qualifying, first position should only show the pole position driver
      if (isQualifying && position === 0) {
        return driver.id === polePosition;
      }
      
      // For other positions, exclude already selected drivers
      return !selectedDrivers.includes(driver.id) || selectedDrivers.indexOf(driver.id) === position;
    });
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
                      <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                        <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
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
                      Tempo da Pole (digite apenas números, ex: 123456 para 1:23.456)
                    </label>
                    <Input
                      id="poleTime"
                      value={poleTime}
                      onChange={handlePoleTimeChange}
                      className="bg-racing-black border-racing-silver/20 text-racing-white placeholder:text-racing-silver/50"
                      placeholder="Digite apenas números"
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
                        disabled={index === 0} // Disable first position as it's controlled by pole position
                      >
                        <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                          <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableDrivers(index).map((driver) => (
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
                        <div className="flex-1">
                          <Select
                            value={raceTop10[index]}
                            onValueChange={(value) => {
                              const newTop10 = [...raceTop10];
                              newTop10[index] = value;
                              setRaceTop10(newTop10);
                            }}
                          >
                            <SelectTrigger className="bg-racing-black border-racing-silver/20 text-racing-white">
                              <SelectValue placeholder="Selecione um piloto" className="text-racing-silver" />
                            </SelectTrigger>
                            <SelectContent className="bg-racing-black border-racing-silver/20">
                              {getAvailableDrivers(index, false).map((driver) => (
                                <SelectItem key={driver.id} value={driver.id} className="text-racing-white hover:bg-racing-silver/20">
                                  {driver.name} ({driver.team.name})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {raceTop10[index] && (
                          <div className="flex items-center space-x-2 min-w-[80px]">
                            <Checkbox
                              id={`dnf-${raceTop10[index]}`}
                              checked={dnfPredictions.includes(raceTop10[index])}
                              onCheckedChange={() => handleDriverDNF(raceTop10[index])}
                              className="h-5 w-5 border-2 border-racing-silver/50 data-[state=checked]:bg-racing-red data-[state=checked]:border-racing-red"
                            />
                            <label
                              htmlFor={`dnf-${raceTop10[index]}`}
                              className="text-sm font-medium text-racing-silver cursor-pointer select-none"
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
