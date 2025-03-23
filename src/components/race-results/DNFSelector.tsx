
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-racing-silver">
        Sobreviventes
      </label>
      <Select
        value={survivorsCount.toString()}
        onValueChange={(value) => {
          // Convert survivors to DNF count and pass to handler
          const survivorCount = parseInt(value);
          const dnfCount = 20 - survivorCount;
          handleDNFCountChange(dnfCount.toString());
        }}
      >
        <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
          <SelectValue placeholder="Selecione quantos pilotos sobreviveram" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black border-racing-silver/20 max-h-[300px]">
          {Array.from({ length: 21 }).map((_, index) => (
            <SelectItem 
              key={index} 
              value={index.toString()}
              className="text-racing-white hover:bg-racing-white hover:text-racing-black focus:bg-racing-white focus:text-racing-black cursor-pointer"
            >
              {index} piloto{index !== 1 ? 's' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
