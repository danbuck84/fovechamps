
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "./Sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(true);
  const isMobile = useIsMobile();

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
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen bg-racing-black flex w-full overflow-hidden">
          <Sidebar 
            username={username}
            isAdmin={isAdmin}
          />
          
          <SidebarInset className="bg-racing-black relative">
            {isMobile && (
              <div className="absolute top-4 left-4 z-50">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-racing-white hover:bg-racing-red/20">
                    <Menu size={24} />
                  </Button>
                </SidebarTrigger>
              </div>
            )}
            <div className="p-4 pt-16 md:pt-4">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default MainLayout;
