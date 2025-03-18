
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DriverDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: driver, isLoading } = useQuery({
    queryKey: ["driver-detail", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(*)")
        .eq("id", id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-racing-silver">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!driver) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black p-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-racing-silver">Piloto não encontrado</p>
            <Button 
              onClick={() => navigate(-1)} 
              className="mt-4 bg-racing-red hover:bg-racing-red/80"
            >
              Voltar
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-racing-silver hover:text-racing-white hover:bg-racing-silver/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <Card className="bg-racing-black border-racing-silver/20">
            <CardHeader>
              <CardTitle className="text-2xl text-racing-white">{driver.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-racing-white mb-2">Informações do Piloto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-racing-silver">Número: <span className="text-racing-white">{driver.number}</span></p>
                    <p className="text-racing-silver">Equipe: <span className="text-racing-white">{driver.team?.name || "N/A"}</span></p>
                    <p className="text-racing-silver">Motor: <span className="text-racing-white">{driver.team?.engine || "N/A"}</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DriverDetail;
