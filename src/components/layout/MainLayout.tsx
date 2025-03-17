
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "./Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

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

  return (
    <div className="min-h-screen bg-racing-black flex">
      <div className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-racing-black border-r border-racing-silver/10`}>
        <Sidebar 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          username={username}
          isAdmin={isAdmin}
        />
      </div>
      
      <div className={`transition-all duration-300 flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
