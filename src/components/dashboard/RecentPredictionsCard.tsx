
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, ArrowRight } from "lucide-react";
import { formatDate } from "@/utils/date-utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Prediction, Race } from "@/types/betting";

interface RecentPredictionsCardProps {
  predictions: (Prediction & { 
    race: Pick<Race, "name" | "date" | "qualifying_date"> 
  })[] | undefined;
}

export const RecentPredictionsCard = ({ predictions }: RecentPredictionsCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-racing-black border-racing-silver/20 overflow-hidden">
      <CardHeader className="bg-racing-black/60 backdrop-blur border-b border-racing-silver/10 pb-3">
        <CardTitle className="text-xl text-racing-white flex items-center">
          <List className="h-5 w-5 mr-2 text-racing-red" />
          Seus Últimos Palpites
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {predictions?.length > 0 ? (
          <div className="divide-y divide-racing-silver/10">
            {predictions.map((prediction) => (
              <div 
                key={prediction.id}
                onClick={() => navigate(`/race-predictions/${prediction.race_id}`)}
                className="p-4 hover:bg-racing-red/5 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold text-racing-white text-lg mb-1">
                  {prediction.race.name}
                </h3>
                <p className="text-sm text-racing-silver">
                  {formatDate(prediction.race.date)}
                </p>
              </div>
            ))}
            <div className="p-4 text-center">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/my-predictions")}
                className="text-racing-red hover:text-racing-red/80 hover:bg-racing-red/10"
              >
                <List className="h-4 w-4 mr-1" />
                Ver todos seus palpites
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="p-4 text-racing-silver">Você ainda não fez nenhuma aposta.</p>
        )}
      </CardContent>
    </Card>
  );
};
