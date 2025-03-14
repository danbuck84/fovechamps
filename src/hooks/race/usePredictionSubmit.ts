
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import type { Race } from "@/types/betting";

export const usePredictionSubmit = (raceId: string | undefined, race: Race | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    poleTime: string,
    fastestLap: string,
    qualifyingTop10: string[],
    raceTop10: string[],
    dnfPredictions: string[],
    existingPredictionQuery: any
  ) => {
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

  return { handleSubmit, navigate };
};
