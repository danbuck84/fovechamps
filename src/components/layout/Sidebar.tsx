
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, Calendar, Users, LogOut, FileText, UserCircle, List, ChevronLeft, ChevronRight, Table, Flag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import NavLink from "./NavLink";

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  username: string;
  isAdmin: boolean;
};

const Sidebar = ({ isCollapsed, setIsCollapsed, username, isAdmin }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full bg-racing-black border-r border-racing-silver/20 z-50"
    >
      <div className="flex flex-col h-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 bg-racing-black border border-racing-silver/20 text-racing-silver hover:text-racing-red hover:bg-racing-black"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        <div className="p-4 border-b border-racing-silver/20">
          <button 
            onClick={() => navigate("/")}
            className={`text-xl font-bold text-racing-white hover:opacity-80 transition-opacity ${isCollapsed ? 'hidden' : 'block'}`}
          >
            FoVe<span className="text-racing-red">Champs</span>
          </button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-2">
            {username && !isCollapsed && (
              <li className="mb-6">
                <div className="px-2 py-1">
                  <span className="text-sm text-racing-silver">Bem-vindo,</span>
                  <p className="text-racing-white font-semibold truncate">{username}</p>
                </div>
              </li>
            )}
            <NavLink path="/dashboard" icon={Trophy} label="Dashboard" isCollapsed={isCollapsed} />
            <NavLink path="/tables" icon={Table} label="Tabelas" isCollapsed={isCollapsed} />
            <NavLink path="/" icon={Calendar} label="Corridas" isCollapsed={isCollapsed} />
            <NavLink path="/official-results" icon={Flag} label="Resultados Oficiais" isCollapsed={isCollapsed} />
            <NavLink path="/all-race-results" icon={List} label="Ver Todos os Resultados" isCollapsed={isCollapsed} />
            <NavLink path="/my-predictions" icon={FileText} label="Minhas Apostas" isCollapsed={isCollapsed} />
            <NavLink path="/users" icon={Users} label="Participantes" isCollapsed={isCollapsed} />

            {isAdmin && (
              <NavLink path="/admin/race-management" icon={Settings} label="Gerenciar Corridas" isCollapsed={isCollapsed} />
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-racing-silver/20">
          <NavLink path="/profile" icon={UserCircle} label="Meu Perfil" isCollapsed={isCollapsed} />
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/auth");
            }} 
            className="flex items-center w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors"
          >
            <LogOut className="w-6 h-6" />
            <span className={isCollapsed ? "hidden" : "ml-3"}>Sair</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
