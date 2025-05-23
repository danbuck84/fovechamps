
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface DNFSelectorProps {
  dnfDrivers: string[];
  onDNFChange: (driverId: string, checked: boolean) => void;
  handleDNFCountChange: (value: string) => void;
}

export const DNFSelector = ({
  dnfDrivers,
  onDNFChange,
  handleDNFCountChange,
}: DNFSelectorProps) => {
  // Calculate survivors count (20 - DNF count)
  const survivorsCount = 20 - dnfDrivers.length;
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-racing-silver">
        Sobreviventes
      </label>
      <div className={isMobile ? "w-full" : ""}>
        <Select
          value={survivorsCount.toString()}
          onValueChange={handleDNFCountChange}
        >
          <SelectTrigger className={`${isMobile ? 'w-full' : 'w-[180px]'} bg-racing-black text-racing-white border-racing-silver/20 min-h-[44px]`}>
            <SelectValue placeholder="Selecione quantos pilotos sobreviveram" />
          </SelectTrigger>
          <SelectContent className="bg-racing-black text-racing-white border-racing-silver/20 max-h-[300px] overflow-y-auto">
            {Array.from({ length: 21 }).map((_, index) => (
              <SelectItem 
                key={index} 
                value={index.toString()}
                className="text-racing-white hover:bg-racing-white/20 hover:text-racing-white focus:bg-racing-white/20 focus:text-racing-white cursor-pointer min-h-[40px] flex items-center px-4 py-2"
              >
                {index} piloto{index !== 1 ? 's' : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2 text-sm text-racing-silver">
        {dnfDrivers.length > 0 ? (
          <p>{dnfDrivers.length} piloto{dnfDrivers.length !== 1 ? 's' : ''} não completaram a corrida</p>
        ) : (
          <p>Todos os pilotos completaram a corrida</p>
        )}
      </div>
    </div>
  );
};
