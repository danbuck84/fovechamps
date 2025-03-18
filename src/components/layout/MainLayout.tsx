
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(true);
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
      <div className={`fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-0 -translate-x-full' : 'w-64'} transition-all duration-300 bg-racing-black border-r border-racing-silver/10`}>
        <Sidebar 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          username={username}
          isAdmin={isAdmin}
        />
      </div>
      
      <div className={`transition-all duration-300 flex-1 ${isCollapsed ? 'ml-0' : 'ml-64'}`}>
        <div className="fixed top-4 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-racing-black/80 text-racing-silver hover:bg-racing-red/10 rounded-full"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
