
import { useSidebar } from "@/components/ui/sidebar/context";
import Sidebar from "./Sidebar";
import { SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface MainLayoutProps {
  children: React.ReactNode;
  username?: string;
  isAdmin?: boolean;
}

const MainLayout = ({ children, username = "", isAdmin = false }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  
  // Fechar o sidebar móvel quando a tela ficar maior
  useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <TooltipProvider>
      <div className="flex w-full min-h-screen bg-racing-black">
        <Sidebar 
          username={username}
          isAdmin={isAdmin}
        />
        
        <SidebarInset className="bg-racing-black flex-1 flex flex-col">
          {isMobile && (
            <div className="sticky top-4 left-4 z-50 p-2">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-racing-white hover:bg-racing-red/20">
                  <Menu size={24} />
                </Button>
              </SidebarTrigger>
            </div>
          )}
          <div className="p-4 w-full flex-1 flex flex-col items-center">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
