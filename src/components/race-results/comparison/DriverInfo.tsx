
import type { Driver } from "@/types/betting";

interface DriverInfoProps {
  driverId: string;
  drivers: (Driver & { team: { name: string } })[];
}

const DriverInfo = ({ driverId, drivers }: DriverInfoProps) => {
  if (!driverId) return <span className="text-racing-white">Piloto não selecionado</span>;
  
  const driver = drivers.find(d => d.id === driverId);
  return (
    <span className="text-racing-white">
      {driver ? `${driver.name} (${driver.team.name})` : "Piloto não encontrado"}
    </span>
  );
};

export default DriverInfo;
