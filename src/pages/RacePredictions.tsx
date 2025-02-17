
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PolePositionForm } from "@/components/race-predictions/PolePositionForm";
import { QualifyingPredictionForm } from "@/components/race-predictions/QualifyingPredictionForm";
import { RacePredictionForm } from "@/components/race-predictions/RacePredictionForm";
import { formatDate } from "@/utils/date-utils";
import { formatPoleTime } from "@/utils/prediction-utils";
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
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

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
    if (race) {
      const checkDeadline = () => {
        const qualifyingDate = new Date(race.qualifying_date);
        const now = new Date();
        const oneHourBefore = new Date(qualifyingDate.getTime() - 60 * 60 * 1000);
        
        // Check if we're within one hour of the deadline
        if (now >= oneHourBefore && now < qualifyingDate && !isDeadlinePassed) {
          toast({
            title: "Atenção!",
            description: "Falta menos de 1 hora para o fechamento das apostas!",
            duration: 10000,
          });
        }

        // Check if deadline has passed
        setIsDeadlinePassed(now >= qualifyingDate);
      };

      // Check immediately
      checkDeadline();

      // Set up interval to check every minute
      const interval = setInterval(checkDeadline, 60000);

      return () => clearInterval(interval);
    }
  }, [race, toast, isDeadlinePassed]);

  useEffect(() => {
    if (polePosition) {
      setQualifyingTop10(prev => {
        const newTop10 = [...prev];
        newTop10[0] = polePosition;
        return newTop10;
      });
    }
  }, [polePosition]);

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

    if (isDeadlinePassed) {
      toast({
        title: "Erro",
        description: "O prazo para apostas já encerrou",
        variant: "destructive",
      });
      return;
    }

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

  const handlePoleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    
    return drivers.filter(driver => {
      if (isQualifying && position === 0) {
        return driver.id === polePosition;
      }
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
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            className="text-racing-silver hover:text-racing-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            variant="ghost"
            className="text-racing-silver hover:text-racing-white"
            asChild
          >
            <Link to="/my-predictions">
              Ver Minhas Apostas
            </Link>
          </Button>
        </div>

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
            {isDeadlinePassed ? (
              <div className="mt-4 p-4 bg-racing-red/10 border border-racing-red rounded-md flex items-center gap-2 text-racing-red">
                <Clock className="h-5 w-5" />
                <p>O prazo para apostas já encerrou</p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-racing-silver/10 border border-racing-silver/20 rounded-md flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <p>Prazo para apostas: até {formatDate(race.qualifying_date)}</p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <PolePositionForm
                drivers={drivers}
                polePosition={polePosition}
                setPolePosition={setPolePosition}
                poleTime={poleTime}
                onPoleTimeChange={handlePoleTimeChange}
                disabled={isDeadlinePassed}
              />

              <QualifyingPredictionForm
                drivers={drivers}
                qualifyingTop10={qualifyingTop10}
                setQualifyingTop10={setQualifyingTop10}
                getAvailableDrivers={getAvailableDrivers}
                disabled={isDeadlinePassed}
              />

              <RacePredictionForm
                raceTop10={raceTop10}
                setRaceTop10={setRaceTop10}
                dnfPredictions={dnfPredictions}
                onDriverDNF={handleDriverDNF}
                getAvailableDrivers={getAvailableDrivers}
                disabled={isDeadlinePassed}
              />

              <Button 
                type="submit"
                className="w-full bg-racing-red hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeadlinePassed}
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
