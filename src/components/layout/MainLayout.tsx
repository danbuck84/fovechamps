
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "./Sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false); // Changed to false to keep sidebar expanded
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
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen bg-racing-black flex w-full">
          <Sidebar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            username={username}
            isAdmin={isAdmin}
          />
          
          <SidebarInset className="bg-racing-black">
            <div className="p-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default MainLayout;
