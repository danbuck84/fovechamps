
import { Button } from "@/components/ui/button";

interface CopyGridButtonProps {
  isDeadlinePassed: boolean;
  onCopyGrid: () => void;
}

export const CopyGridButton = ({ isDeadlinePassed, onCopyGrid }: CopyGridButtonProps) => (
  <Button
    type="button"
    onClick={onCopyGrid}
    className="bg-racing-blue hover:bg-racing-blue/90 text-racing-white"
    disabled={isDeadlinePassed}
  >
    Usar Grid de Largada como Resultado da Corrida
  </Button>
);
