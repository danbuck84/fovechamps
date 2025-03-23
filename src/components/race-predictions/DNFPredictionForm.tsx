
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DNFPredictionFormProps {
  dnfPredictions: string[];
  onDriverDNF: (count: number) => void;
  disabled?: boolean;
}

export const DNFPredictionForm = ({
  dnfPredictions,
  onDriverDNF,
  disabled = false,
}: DNFPredictionFormProps) => {
  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-racing-white">Sobreviventes</h3>
        <p className="text-sm text-racing-silver">
          Quantos pilotos sobreviverão à corrida?
        </p>
      </div>
      
      <Select
        value={dnfPredictions.length.toString()}
        onValueChange={(value) => onDriverDNF(parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className="bg-racing-white text-racing-black border-racing-silver/20 w-full">
          <SelectValue placeholder="Selecione um número" />
        </SelectTrigger>
        <SelectContent className="bg-racing-white border-racing-silver/20">
          {Array.from({ length: 21 }, (_, i) => (
            <SelectItem 
              key={i} 
              value={i.toString()}
              className="hover:bg-racing-black hover:text-racing-white focus:bg-racing-black focus:text-racing-white cursor-pointer"
            >
              {i} piloto{i !== 1 ? 's' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
