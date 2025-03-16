
import { formatPoleTime } from "@/utils/prediction-utils";
import { useToast } from "@/hooks/use-toast";

export const useFormatters = () => {
  const { toast } = useToast();

  const handlePoleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPoleTime: (value: string) => void
  ) => {
    const formatted = formatPoleTime(e.target.value);
    if (formatted !== undefined) {
      setPoleTime(formatted);
    } else {
      toast({
        title: "Tempo inválido",
        description: "Os segundos não podem ser maiores que 59",
        variant: "destructive",
      });
    }
  };

  // Format raw numbers like 123456 to 1:23.456 for display
  const formatDisplayPoleTime = (poleTime: string) => {
    // If the poleTime is already formatted, return it
    if (poleTime.includes(':') || poleTime.includes('.')) {
      return poleTime;
    }

    const numbers = poleTime.replace(/\D/g, '');
    if (numbers.length < 6) return poleTime; // Return original if not enough digits

    const minutes = numbers[0];
    const seconds = numbers.substring(1, 3);
    const milliseconds = numbers.substring(3, 6);
    
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return { handlePoleTimeChange, formatDisplayPoleTime };
};
