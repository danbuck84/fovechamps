
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useMyPredictions } from "@/hooks/useMyPredictions";
import PredictionsList from "@/components/predictions/PredictionsList";
import LoadingState from "@/components/predictions/LoadingState";
import EmptyState from "@/components/predictions/EmptyState";
import MainLayout from "@/components/layout/MainLayout";
import { ScrollArea } from "@/components/ui/scroll-area";

const MyPredictions = () => {
  const navigate = useNavigate();
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

  const { predictions, isLoading, error, driversMap, refetch } = useMyPredictions(userId);

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-racing-red">Erro ao carregar suas apostas. Por favor, tente novamente.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-racing-white mb-8">Minhas Apostas</h1>
        
        <ScrollArea className="h-full" type="always">
          {predictions && predictions.length > 0 ? (
            <PredictionsList 
              predictions={predictions} 
              driversMap={driversMap}
              refetch={refetch}
            />
          ) : (
            <EmptyState />
          )}
        </ScrollArea>
      </div>
    </MainLayout>
  );
};

export default MyPredictions;
