import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RacePredictionsHeader } from "@/components/race-predictions/RacePredictionsHeader";
import { RaceInfoHeader } from "@/components/race-predictions/RaceInfoHeader";
import { PredictionForm } from "@/components/race-predictions/PredictionForm";
import { ExistingPredictionCard } from "@/components/race-predictions/ExistingPredictionCard";
import { formatPoleTime } from "@/utils/prediction-utils";
import type { Race, Driver } from "@/types/betting";

const RacePredictions = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(20).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(20).fill(""));
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

      const qualifyingDate = new Date(data.qualifying_date);
      const now = new Date();

      console.log('Data da Classificação:', qualifyingDate.toLocaleString());
      console.log('Data atual:', now.toLocaleString());
      
      setIsDeadlinePassed(false);
      
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

  const { data: existingPredictionQuery } = useQuery({
    queryKey: ["prediction", raceId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !raceId) return null;

      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("race_id", raceId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar palpite existente:", error);
        return null;
      }

      return data;
    },
    enabled: !!raceId,
  });

  useEffect(() => {
    if (existingPredictionQuery && !isDeadlinePassed) {
      setExistingPrediction(existingPredictionQuery);
      setPoleTime(existingPredictionQuery.pole_time || "");
      setFastestLap(existingPredictionQuery.fastest_lap || "");
      setQualifyingTop10(existingPredictionQuery.qualifying_results || Array(20).fill(""));
      setRaceTop10(existingPredictionQuery.top_10 || Array(20).fill(""));
      setDnfPredictions(existingPredictionQuery.dnf_predictions || []);
    }
  }, [existingPredictionQuery, isDeadlinePassed]);

  const handleDriverDNF = (count: number) => {
    setDnfPredictions(Array(count).fill(""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
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
      user_id: user.id,
      pole_position: qualifyingTop10[0] || "",
      pole_time: poleTime,
      fastest_lap: fastestLap,
      qualifying_results: qualifyingTop10.filter(Boolean),
      top_10: raceTop10.filter(Boolean),
      dnf_predictions: dnfPredictions,
    };
    
    try {
      let result;
      
      if (existingPredictionQuery?.id) {
        result = await supabase
          .from("predictions")
          .update(predictionData)
          .eq("id", existingPredictionQuery.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("predictions")
          .insert([predictionData])
          .select()
          .single();
      }

      if (result.error) {
        console.error("Erro ao salvar palpites:", result.error);
        toast({
          title: "Erro ao salvar palpites",
          description: result.error.message || "Por favor, tente novamente",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Palpites salvos com sucesso!",
        description: "Boa sorte!",
      });

      navigate("/my-predictions");
    } catch (error) {
      console.error("Erro ao salvar palpites:", error);
      toast({
        title: "Erro ao salvar palpites",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    }
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

  if (existingPrediction && !isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white">
        <div className="container mx-auto px-4 py-8">
          <RacePredictionsHeader onBack={() => navigate(-1)} />
          <ExistingPredictionCard
            race={race}
            isDeadlinePassed={isDeadlinePassed}
            onEdit={() => setExistingPrediction(null)}
            onViewPredictions={() => navigate("/my-predictions")}
          />
        </div>
      </div>
    );
  }

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
            <PredictionForm
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
              fastestLap={fastestLap}
              setFastestLap={setFastestLap}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
