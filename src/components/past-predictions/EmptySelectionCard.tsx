
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptySelectionCard = () => {
  return (
    <Card className="bg-racing-black border-racing-silver/20 h-full flex items-center justify-center">
      <CardContent className="py-12 text-center">
        <Clock className="h-12 w-12 text-racing-silver mx-auto mb-4" />
        <p className="text-racing-silver text-lg">
          Selecione uma corrida para ver as apostas e resultados
        </p>
      </CardContent>
    </Card>
  );
};
