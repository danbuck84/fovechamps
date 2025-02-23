
import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Calendar, Users, LogOut, FileText, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/types/user";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
      }
    };

    getProfile();
  }, []);

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
            <button 
              onClick={() => navigate("/")}
              className="hidden md:block text-xl font-bold text-racing-white hover:opacity-80 transition-opacity"
            >
              FoVe<span className="text-racing-red">Champs</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-2">
              {username && (
                <li className="mb-6">
                  <div className="px-2 py-1">
                    <span className="text-sm text-racing-silver">Bem-vindo,</span>
                    <p className="text-racing-white font-semibold truncate">{username}</p>
                  </div>
                </li>
              )}
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
              <li>
                <button
                  onClick={() => navigate("/my-predictions")}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    isActive("/my-predictions")
                      ? "text-racing-red bg-racing-red/10"
                      : "text-racing-silver hover:bg-racing-red/10"
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <span className="hidden md:block ml-3">Minhas Apostas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate("/users")}
                  className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                    isActive("/users")
                      ? "text-racing-red bg-racing-red/10"
                      : "text-racing-silver hover:bg-racing-red/10"
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <span className="hidden md:block ml-3">Participantes</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-racing-silver/20">
            <button
              onClick={() => navigate("/profile")}
              className={`flex items-center w-full p-2 rounded-lg transition-colors mb-2 ${
                isActive("/profile")
                  ? "text-racing-red bg-racing-red/10"
                  : "text-racing-silver hover:bg-racing-red/10"
              }`}
            >
              <UserCircle className="w-6 h-6" />
              <span className="hidden md:block ml-3">Meu Perfil</span>
            </button>
            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/auth");
              }} 
              className="flex items-center w-full p-2 text-racing-silver hover:bg-racing-red/10 rounded-lg transition-colors"
            >
              <LogOut className="w-6 h-6" />
              <span className="hidden md:block ml-3">Sair</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="ml-16 md:ml-64">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
