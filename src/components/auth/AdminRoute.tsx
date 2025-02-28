
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Este componente não é mais necessário, mas mantemos como um wrapper simples
// já que foi referenciado em outros lugares
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  // Como não temos mais restrições de administrador, simplesmente renderizamos as crianças
  return <>{children}</>;
}
