import { useState } from "react";
import {
  LayoutDashboard,
  BarChart,
  Table2,
  CircleCheck,
  BadgeDollarSign,
  UserCircle,
  ShieldCheck,
  Users,
  CalendarCheck,
  Clock,
  ChevronDown,
} from "lucide-react";
import NavLink from "./NavLink";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [betsOpen, setBetsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  return (
    <div className="overflow-y-auto py-4 px-3 flex flex-col h-full justify-between">
      <ul className="space-y-2">
        {/* Dashboard */}
        <NavLink
          path="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />

        {/* Results */}
        <li>
          <button
            onClick={() => setResultsOpen(!resultsOpen)}
            className={`flex items-center justify-between w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors`}
          >
            <div className="flex items-center">
              <BarChart className="w-6 h-6" />
              <span className={isCollapsed ? "hidden" : "ml-3"}>Resultados</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                resultsOpen ? "rotate-180" : ""
              } ${isCollapsed ? "hidden" : ""}`}
            />
          </button>
          <ul
            className={`py-2 space-y-2 ${
              resultsOpen ? "block" : "hidden"
            }`}
          >
            <NavLink
              path="/all-race-results"
              icon={Trophy}
              label="Todos Resultados"
              isCollapsed={isCollapsed}
            />
            <NavLink
              path="/tables"
              icon={Table2}
              label="Tabelas"
              isCollapsed={isCollapsed}
            />
            <NavLink
              path="/official-results"
              icon={CircleCheck}
              label="Resultados Oficiais"
              isCollapsed={isCollapsed}
            />
          </ul>
        </li>

        {/* Bets */}
        <li>
          <button
            onClick={() => setBetsOpen(!betsOpen)}
            className={`flex items-center justify-between w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors`}
          >
            <div className="flex items-center">
              <BadgeDollarSign className="w-6 h-6" />
              <span className={isCollapsed ? "hidden" : "ml-3"}>Apostas</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                betsOpen ? "rotate-180" : ""
              } ${isCollapsed ? "hidden" : ""}`}
            />
          </button>
          <ul
            className={`py-2 space-y-2 ${
              betsOpen ? "block" : "hidden"
            }`}
          >
            <NavLink
              path="/my-predictions"
              icon={UserCircle}
              label="Minhas Apostas"
              isCollapsed={isCollapsed}
            />
            <NavLink
              path="/past-predictions"
              icon={Clock}
              label="Apostas Passadas"
              isCollapsed={isCollapsed}
            />
          </ul>
        </li>

        {/* Admin */}
        <li>
          <button
            onClick={() => setAdminOpen(!adminOpen)}
            className={`flex items-center justify-between w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors`}
          >
            <div className="flex items-center">
              <ShieldCheck className="w-6 h-6" />
              <span className={isCollapsed ? "hidden" : "ml-3"}>Admin</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                adminOpen ? "rotate-180" : ""
              } ${isCollapsed ? "hidden" : ""}`}
            />
          </button>
          <ul
            className={`py-2 space-y-2 ${
              adminOpen ? "block" : "hidden"
            }`}
          >
            <NavLink
              path="/users"
              icon={Users}
              label="Usuários"
              isCollapsed={isCollapsed}
            />
            <NavLink
              path="/admin/race-management"
              icon={CalendarCheck}
              label="Gerenciar Corridas"
              isCollapsed={isCollapsed}
            />
          </ul>
        </li>
      </ul>

      <div className="p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors"
        >
          {isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
