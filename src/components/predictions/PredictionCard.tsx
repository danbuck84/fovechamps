
import { Link } from "react-router-dom";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface PredictionCardProps {
  prediction: any;
  driversMap: Record<string, string>;
  handleDelete: (predictionId: string, event?: React.MouseEvent) => Promise<void>;
}

const PredictionCard = ({ prediction, driversMap, handleDelete }: PredictionCardProps) => {
  return (
    <Link 
      to={`/race-predictions/${prediction.races?.id}`}
      className="block bg-racing-black border border-racing-silver/20 rounded-lg p-6 hover:bg-racing-black/80 transition-colors"
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
            {prediction.pole_time && (
              <p className="text-racing-white">
                <span className="text-racing-silver">Tempo da Pole:</span>{" "}
                {prediction.pole_time}
              </p>
            )}
            <p className="text-racing-white">
              <span className="text-racing-silver">Pole Position:</span>{" "}
              {driversMap[prediction.pole_position] || "Piloto não encontrado"}
            </p>
            {prediction.fastest_lap && (
              <p className="text-racing-white">
                <span className="text-racing-silver">Volta mais rápida:</span>{" "}
                {driversMap[prediction.fastest_lap] || "Piloto não encontrado"}
              </p>
            )}
          </div>
          
          <div className="mt-4 flex items-center text-racing-red">
            <span className="text-sm">Ver detalhes completos</span>
            <ChevronRight size={16} className="ml-1" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-racing-black text-racing-white border-racing-silver/20 hover:bg-racing-red hover:text-racing-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete(prediction.id, e);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default PredictionCard;
