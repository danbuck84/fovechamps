
import {
  Home,
  Calendar,
  Settings,
  Users2,
  LogOut,
} from "lucide-react";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, icon, label }) => (
  <Button
    asChild
    variant="ghost"
    className={`w-full justify-start pl-9 ${
      isActive
        ? "bg-racing-red text-racing-white hover:bg-racing-red/80"
        : "text-racing-silver hover:bg-racing-red/10"
    }`}
  >
    <RouterLink to={to} className="flex items-center gap-2 w-full">
      {icon}
      <span>{label}</span>
    </RouterLink>
  </Button>
);

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  username,
  isAdmin = false,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  username: string;
  isAdmin?: boolean;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        <h1 className="font-bold text-2xl text-racing-white">FoVeChamps</h1>
        <p className="text-sm text-racing-silver">
          Gerencie suas apostas e resultados
        </p>
      </div>

      <nav className="flex-1">
        <NavLink
          to="/dashboard"
          isActive={location.pathname === "/dashboard"}
          icon={<Home size={20} />}
          label="Visão Geral"
        />
        <NavLink
          to="/tables"
          isActive={location.pathname === "/tables"}
          icon={<Calendar size={20} />}
          label="Tabelas"
        />
        <NavLink
          to="/my-predictions"
          isActive={location.pathname === "/my-predictions"}
          icon={<Calendar size={20} />}
          label="Meus Palpites"
        />
        {isAdmin && (
          <NavLink
            to="/admin/race-management"
            isActive={location.pathname === "/admin/race-management"}
            icon={<Settings size={20} />}
            label="Gerenciar Corridas"
          />
        )}
        <NavLink
          to="/drivers-and-teams"
          isActive={location.pathname === "/drivers-and-teams"}
          icon={<Users2 size={20} />}
          label="Pilotos e Equipes"
        />
      </nav>

      {username && (
        <div className="mt-auto p-4 border-t border-racing-silver/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-racing-red flex items-center justify-center text-racing-white font-bold">
              {username[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-racing-white text-sm font-medium">{username}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-racing-silver border-racing-silver/20 hover:bg-racing-red/10 hover:text-racing-white"
              onClick={() => navigate('/profile')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start text-racing-silver border-racing-silver/20 hover:bg-racing-red hover:text-racing-white hover:border-transparent"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
