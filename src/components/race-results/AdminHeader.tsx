
import { useNavigate } from "react-router-dom";
import { AdminActionButtons } from "./AdminActionButtons";

interface AdminHeaderProps {
  raceName: string | undefined;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

export const AdminHeader = ({
  raceName,
  onSave,
  isLoading
}: AdminHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-racing-white">{raceName} - Resultados Oficiais</h1>
      <AdminActionButtons onSave={onSave} isLoading={isLoading} />
    </div>
  );
};
