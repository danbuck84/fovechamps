
import { useSidebar } from "@/components/ui/sidebar/context";
import Sidebar from "./Sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  username?: string;
  isAdmin?: boolean;
}

const MainLayout = ({ children, username = "", isAdmin = false }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-screen bg-racing-black">
          <Sidebar 
            username={username}
            isAdmin={isAdmin}
          />
          
          <SidebarInset className="bg-racing-black flex-1 flex flex-col">
            {isMobile && (
              <div className="sticky top-4 left-4 z-50">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-racing-white hover:bg-racing-red/20">
                    <Menu size={24} />
                  </Button>
                </SidebarTrigger>
              </div>
            )}
            <div className="p-4 pt-16 md:pt-4 w-full flex-1 flex flex-col items-center">
              <div className="w-full max-w-7xl">
                {children}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default MainLayout;
