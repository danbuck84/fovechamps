
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
          // Pass the survivors count directly to the handler
          console.log(`Selected ${value} survivors`);
          handleDNFCountChange(value);
        }}
      >
        <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
          <SelectValue placeholder="Selecione quantos pilotos sobreviveram" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black text-racing-white border-racing-silver/20 max-h-[300px]">
          {Array.from({ length: 21 }).map((_, index) => (
            <SelectItem 
              key={index} 
              value={index.toString()}
              className="text-racing-white hover:bg-racing-white/20 hover:text-racing-white focus:bg-racing-white/20 focus:text-racing-white cursor-pointer"
            >
              {index} piloto{index !== 1 ? 's' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
