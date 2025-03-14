
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { formatPoleTime } from "@/utils/prediction-utils";
import { isDeadlinePassed } from "@/utils/date-utils";
import type { Race, Driver } from "@/types/betting";

export const useRacePrediction = (raceId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAdmin = true; // Todos os usuários têm acesso de administrador
  
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingTop10, setQualifyingTop10] = useState<string[]>(Array(20).fill(""));
  const [raceTop10, setRaceTop10] = useState<string[]>(Array(20).fill(""));
  const [dnfPredictions, setDnfPredictions] = useState<string[]>([]);
  const [existingPrediction, setExistingPrediction] = useState<any>(null);
  const [isDeadlinePassedState, setIsDeadlinePassedState] = useState(false);

  // Fetch race data
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
      
      const hasDeadlinePassed = isDeadlinePassed(data.qualifying_date);
      console.log('Prazo encerrado?', hasDeadlinePassed);
      
      setIsDeadlinePassedState(hasDeadlinePassed);
      
      return data as Race;
    },
    enabled: !!raceId,
  });

  // Fetch drivers data
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

  // Fetch existing prediction
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

  // Set up form data from existing prediction
  useEffect(() => {
    if (existingPredictionQuery && !isDeadlinePassedState) {
      setExistingPrediction(existingPredictionQuery);
      setPoleTime(existingPredictionQuery.pole_time || "");
      setFastestLap(existingPredictionQuery.fastest_lap || "");
      setQualifyingTop10(existingPredictionQuery.qualifying_results || Array(20).fill(""));
      setRaceTop10(existingPredictionQuery.top_10 || Array(20).fill(""));
      setDnfPredictions(existingPredictionQuery.dnf_predictions || []);
    }
  }, [existingPredictionQuery, isDeadlinePassedState]);

  // Helper functions
  const handleDriverDNF = (count: number) => {
    setDnfPredictions(Array(count).fill(""));
  };

  const getAvailableDrivers = (position: number, isQualifying: boolean = true) => {
    if (!drivers) return [];
    
    const selectedDrivers = isQualifying ? qualifyingTop10 : raceTop10;
    
    return drivers.filter(driver => {
      return !selectedDrivers.includes(driver.id) || selectedDrivers.indexOf(driver.id) === position;
    });
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

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (race) {
      const qualifyingDate = new Date(race.qualifying_date);
      const now = new Date();
      if (now >= qualifyingDate) {
        toast({
          title: "Prazo encerrado",
          description: "O prazo para palpites deste Grande Prêmio já encerrou.",
          variant: "destructive",
        });
        return;
      }
    }

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

  return {
    race,
    drivers,
    poleTime,
    setPoleTime,
    handlePoleTimeChange,
    fastestLap,
    setFastestLap,
    qualifyingTop10,
    setQualifyingTop10,
    raceTop10,
    setRaceTop10,
    dnfPredictions,
    handleDriverDNF,
    getAvailableDrivers,
    isAdmin,
    isLoadingRace,
    isLoadingDrivers,
    isDeadlinePassed: isDeadlinePassedState,
    existingPrediction,
    setExistingPrediction,
    handleSubmit,
    navigate
  };
};
