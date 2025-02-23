
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
import type { Race, Driver } from "@/types/betting";

const RacePredictions = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(11).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(11).fill(""));
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

    const { error } = await supabase.from("predictions").insert({
      race_id: raceId,
      user_id: user.data.user.id,
      pole_position: qualifyingTop10[0],
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

  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    
    return drivers.filter(driver => {
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
        <RacePredictionsHeader onBack={() => navigate(-1)} />

        <Card className="bg-racing-black border-racing-silver/20">
          <RaceInfoHeader 
            race={race}
            isDeadlinePassed={false}
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
              isDeadlinePassed={false}
              onSubmit={handleSubmit}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
