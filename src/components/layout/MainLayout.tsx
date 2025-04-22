
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
      <div className="flex w-full min-h-screen bg-fove-navy">
        <Sidebar 
          username={username}
          isAdmin={isAdmin}
        />
        
        <SidebarInset className="bg-fove-navy flex-1 flex flex-col">
          {isMobile && (
            <div className="sticky top-4 left-4 z-50 p-2">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-fove-white hover:bg-fove-red/20">
                  <Menu size={24} />
                </Button>
              </SidebarTrigger>
            </div>
          )}
          <div className="header-bar w-full bg-fove-black border-b border-fove-silver/10 py-2">
            <div className="flex items-center justify-end px-4">
              <div className="flex items-center space-x-2">
                <span className="text-fove-silver">PT-BR</span>
                <span className="text-fove-white">•</span>
                <span className="text-fove-white">{username || 'Usuário'}</span>
              </div>
            </div>
          </div>
          <div className="p-4 w-full flex-1 flex flex-col items-center">
            <div className="w-full max-w-7xl">
              {children}
            </div>
          </div>
          <div className="fove-footer">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                  <h3 className="text-fove-white font-bold text-lg">FoVe Champs</h3>
                  <p className="text-fove-silver text-sm">Campeonato de apostas de Fórmula 1 para os verdadeiros fãs do esporte a motor.</p>
                </div>
                <div className="mt-4 md:mt-0 text-fove-silver text-sm">
                  © {new Date().getFullYear()} FoVe Champs. Todos os direitos reservados.
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </TooltipProvider>
  );
};

export default MainLayout;
