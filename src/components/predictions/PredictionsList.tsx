
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import PredictionCard from "./PredictionCard";

interface PredictionsListProps {
  predictions: any[];
  driversMap: Record<string, string>;
  refetch: () => Promise<any>;
}

const PredictionsList = ({ predictions, driversMap, refetch }: PredictionsListProps) => {
  const { toast } = useToast();

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

  return (
    <div className="space-y-6">
      {predictions.map((prediction: any) => (
        <PredictionCard
          key={prediction.id}
          prediction={prediction}
          driversMap={driversMap}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default PredictionsList;
