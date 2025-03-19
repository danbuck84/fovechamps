
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
  handleDNFCountChange,
}: DNFSelectorProps) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-racing-silver">
        Sobreviventes
      </label>
      <Select
        value={dnfDrivers.length.toString()}
        onValueChange={handleDNFCountChange}
      >
        <SelectTrigger className="w-full bg-racing-black text-racing-white border-racing-silver/20">
          <SelectValue placeholder="Selecione quantos pilotos sobreviveram" />
        </SelectTrigger>
        <SelectContent className="bg-racing-black border-racing-silver/20">
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
