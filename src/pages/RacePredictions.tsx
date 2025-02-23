
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { RacePredictionsHeader } from "@/components/race-predictions/RacePredictionsHeader";
import { RaceInfoHeader } from "@/components/race-predictions/RaceInfoHeader";
import { RacePredictionFormWrapper } from "@/components/race-predictions/RacePredictionFormWrapper";
import { formatPoleTime } from "@/utils/prediction-utils";
import { Button } from "@/components/ui/button";
import type { Race, Driver } from "@/types/betting";
import { formatInTimeZone } from "date-fns-tz";

const RacePredictions = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(11).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(11).fill(""));
  const [dnfPredictions, setDnfPredictions] = useState<string[]>([]);
  const [existingPrediction, setExistingPrediction] = useState<any>(null);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  const { data: race, isLoading: isLoadingRace } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("ID da corrida não fornecido");
      
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Corrida não encontrada");
      
      // Verifica se já passou do horário da classificação
      const qualifyingDateStr = data.qualifying_date;
      const qualifyingDate = new Date(qualifyingDateStr);
      const now = new Date();

      // Converte as datas para o timezone de São Paulo
      const spQualifyingDate = formatInTimeZone(qualifyingDate, 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ssXXX");
      const spNow = formatInTimeZone(now, 'America/Sao_Paulo', "yyyy-MM-dd'T'HH:mm:ssXXX");

      // Converte para Date novamente para comparação
      const qualifyingDateFinal = new Date(spQualifyingDate);
      const nowFinal = new Date(spNow);

      console.log('Data da Classificação:', qualifyingDateFinal);
      console.log('Data Atual:', nowFinal);
      console.log('Prazo passou?', nowFinal > qualifyingDateFinal);
      
      setIsDeadlinePassed(nowFinal > qualifyingDateFinal);
      
      return data as Race;
    },
    enabled: !!raceId,
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

  // Verifica se já existe uma aposta para esta corrida
  useEffect(() => {
    const checkExistingPrediction = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !raceId) return;

      const { data: prediction, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("race_id", raceId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar palpites:", error);
        return;
      }

      if (prediction) {
        setExistingPrediction(prediction);
        if (!isDeadlinePassed) {
          // Se encontrou uma previsão existente e não passou do prazo, preenche o formulário
          setPoleTime(prediction.pole_time || "");
          setFastestLap(prediction.fastest_lap || "");
          setQualifyingTop10(prediction.qualifying_top_10);
          setRaceTop10(prediction.top_10);
          setDnfPredictions(prediction.dnf_predictions);
        }
      }
    };

    checkExistingPrediction();
  }, [raceId]);

  useEffect(() => {
    if (poleTime) {
      setQualifyingTop10(prev => {
        const newTop10 = [...prev];
        newTop10[0] = poleTime;
        return newTop10;
      });
    }
  }, [poleTime]);

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

    const predictionData = {
      race_id: raceId,
      user_id: user.data.user.id,
      pole_position: qualifyingTop10[0],
      pole_time: poleTime,
      fastest_lap: fastestLap,
      qualifying_top_10: qualifyingTop10,
      top_10: raceTop10,
      dnf_predictions: dnfPredictions,
    };

    let error;
    if (existingPrediction) {
      // Atualiza a previsão existente
      const { error: updateError } = await supabase
        .from("predictions")
        .update(predictionData)
        .eq("id", existingPrediction.id);
      error = updateError;
    } else {
      // Cria uma nova previsão
      const { error: insertError } = await supabase
        .from("predictions")
        .insert([predictionData]);
      error = insertError;
    }

    if (error) {
      console.error("Erro ao salvar palpites:", error);
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

  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    
    return drivers.filter(driver => {
      return !selectedDrivers.includes(driver.id) || selectedDrivers.indexOf(driver.id) === position;
    });
  };

  if (isLoadingRace || isLoadingDrivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando informações...</p>
      </div>
    );
  }

  if (!race || !drivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Corrida não encontrada</p>
      </div>
    );
  }

  // Se já existe uma aposta e o prazo não passou, mostra botão de editar
  if (existingPrediction && !isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white">
        <div className="container mx-auto px-4 py-8">
          <RacePredictionsHeader onBack={() => navigate(-1)} />
          <Card className="bg-racing-black border-racing-silver/20">
            <RaceInfoHeader 
              race={race}
              isDeadlinePassed={isDeadlinePassed}
            />
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-racing-silver mb-4">
                Você já fez seus palpites para este Grande Prêmio.
              </p>
              <div className="space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/my-predictions")}
                  className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-silver/20"
                >
                  Ver Meus Palpites
                </Button>
                <Button
                  onClick={() => setExistingPrediction(null)}
                  className="bg-racing-red hover:bg-racing-red/90"
                >
                  Editar Palpites
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Se o prazo passou, não permite fazer apostas
  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white">
        <div className="container mx-auto px-4 py-8">
          <RacePredictionsHeader onBack={() => navigate(-1)} />
          <Card className="bg-racing-black border-racing-silver/20">
            <RaceInfoHeader 
              race={race}
              isDeadlinePassed={isDeadlinePassed}
            />
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-racing-silver mb-4">
                O prazo para fazer palpites para este Grande Prêmio já encerrou.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/my-predictions")}
                className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-silver/20"
              >
                Ver Meus Palpites
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <RacePredictionsHeader onBack={() => navigate(-1)} />

        <Card className="bg-racing-black border-racing-silver/20">
          <RaceInfoHeader 
            race={race}
            isDeadlinePassed={isDeadlinePassed}
          />
          <CardContent>
            <RacePredictionFormWrapper
              drivers={drivers}
              poleTime={poleTime}
              onPoleTimeChange={(e) => {
                const formatted = formatPoleTime(e.target.value);
                if (formatted !== undefined) {
                  setPoleTime(formatted);
                } else {
                  toast({
                    title: "Tempo inválido",
                    description: "Os segundos não podem ser maiores que 59",
                    variant: "destructive",
                  });
                }
              }}
              qualifyingTop10={qualifyingTop10}
              setQualifyingTop10={setQualifyingTop10}
              raceTop10={raceTop10}
              setRaceTop10={setRaceTop10}
              dnfPredictions={dnfPredictions}
              onDriverDNF={handleDriverDNF}
              getAvailableDrivers={getAvailableDrivers}
              isDeadlinePassed={isDeadlinePassed}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
