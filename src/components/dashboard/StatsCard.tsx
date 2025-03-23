
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const StatsCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
      <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
        <CardTitle className="text-xl text-racing-white flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-racing-red" />
          Estatísticas
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col items-center justify-center py-6">
          <BarChart2 className="h-16 w-16 text-racing-red mb-4" />
          <div className="text-center">
            <p className="text-racing-silver mb-4">
              Acesse estatísticas detalhadas das corridas e rankings de usuários
            </p>
            <Button 
              variant="default"
              onClick={() => navigate("/tables")}
              className="bg-racing-red hover:bg-racing-red/90 text-white"
            >
              Ver Estatísticas
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
