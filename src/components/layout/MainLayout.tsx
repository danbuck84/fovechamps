
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Calendar, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-racing-black">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="fixed top-0 left-0 h-full w-16 md:w-64 bg-racing-black border-r border-racing-silver/20"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-racing-silver/20">
            <h1 className="hidden md:block text-xl font-bold text-racing-white">
              FoVe
              <span className="text-racing-red">Champs</span>
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "text-racing-red bg-racing-red/10"
                      : "text-racing-silver hover:bg-racing-red/10"
                  }`}
                >
                  <Trophy className="w-6 h-6" />
                  <span className="hidden md:block ml-3">Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/")}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    isActive("/")
                      ? "text-racing-red bg-racing-red/10"
                      : "text-racing-silver hover:bg-racing-red/10"
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                  <span className="hidden md:block ml-3">Corridas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/leaderboard")}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    isActive("/leaderboard")
                      ? "text-racing-red bg-racing-red/10"
                      : "text-racing-silver hover:bg-racing-red/10"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="hidden md:block ml-3">Classificação</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-racing-silver/20">
            <button className="flex items-center w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors">
              <LogOut className="w-6 h-6" />
              <span className="hidden md:block ml-3">Sair</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="ml-16 md:ml-64">
        <main className="min-h-screen p-4">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
