
import { Trash2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import PredictionCard from "./PredictionCard";
import { useNavigate } from "react-router-dom";

interface PredictionsListProps {
  predictions: any[];
  driversMap: Record<string, string>;
  refetch: () => Promise<any>;
}

const PredictionsList = ({ predictions, driversMap, refetch }: PredictionsListProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handlePredictionClick = (raceId: string) => {
    navigate(`/race-predictions/${raceId}`);
  };

  return (
    <div className="space-y-6">
      {predictions.map((prediction: any) => (
        <div 
          key={prediction.id} 
          className="relative cursor-pointer transition-all hover:translate-x-1 hover:opacity-90"
          onClick={() => handlePredictionClick(prediction.race_id)}
        >
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
            <ChevronRight className="h-5 w-5 text-racing-silver" />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <PredictionCard
              prediction={prediction}
              driversMap={driversMap}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PredictionsList;
