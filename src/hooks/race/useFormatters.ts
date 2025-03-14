
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

  return { handlePoleTimeChange };
};
