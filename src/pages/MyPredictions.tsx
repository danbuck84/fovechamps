
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const MyPredictions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);
    };

    checkUser();
  }, [navigate]);

  const { data: predictions, isLoading, error, refetch } = useQuery({
    queryKey: ["my-predictions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("predictions")
        .select(`
          *,
          races (
            id,
            name,
            circuit,
            country,
            date,
            qualifying_date
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!userId,
  });

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-racing-silver">Carregando suas apostas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-racing-red">Erro ao carregar suas apostas. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-racing-white mb-8">Minhas Apostas</h1>
      
      {predictions && predictions.length > 0 ? (
        <div className="space-y-6">
          {predictions.map((prediction: any) => (
            <div
              key={prediction.id}
              className="bg-racing-black border border-racing-silver/20 rounded-lg p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-racing-white mb-2">
                    {prediction.races?.name}
                  </h2>
                  <p className="text-racing-silver mb-1">
                    Circuito: {prediction.races?.circuit}
                  </p>
                  <p className="text-racing-silver mb-4">
                    Data da corrida:{" "}
                    {prediction.races?.date &&
                      format(new Date(prediction.races.date), "dd 'de' MMMM", {
                        locale: ptBR,
                      })}
                  </p>
                  <div className="space-y-2">
                    <p className="text-racing-white">
                      <span className="text-racing-silver">Pole Position:</span>{" "}
                      {prediction.pole_position}
                    </p>
                    {prediction.pole_time && (
                      <p className="text-racing-white">
                        <span className="text-racing-silver">Tempo da Pole:</span>{" "}
                        {prediction.pole_time}
                      </p>
                    )}
                    {prediction.fastest_lap && (
                      <p className="text-racing-white">
                        <span className="text-racing-silver">Volta mais rápida:</span>{" "}
                        {prediction.fastest_lap}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/race-predictions/${prediction.races?.id}`}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-red hover:text-racing-white"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-red hover:text-racing-white"
                    onClick={() => handleDelete(prediction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-racing-silver">Você ainda não fez nenhuma aposta.</p>
      )}
    </div>
  );
};

export default MyPredictions;
