
import React from "react";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Settings,
  Users2,
  LogOut,
  BarChart3,
  Trophy
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Sidebar as UISidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar/context";

interface SidebarProps {
  username: string;
  isAdmin?: boolean;
}

const Sidebar = ({ username, isAdmin = false }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setOpenMobile(false); // Close mobile sidebar after navigation
  };

  return (
    <UISidebar>
      <SidebarHeader>
        <div className="px-4 py-2">
          <h1 className="font-bold text-2xl text-racing-white">FoVeChamps</h1>
          <p className="text-sm text-racing-silver">
            Gerencie suas apostas e resultados
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-racing-silver">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/dashboard")}
                  isActive={location.pathname === "/dashboard"}
                  tooltip="Visão Geral"
                  className="text-racing-white hover:bg-racing-red/10 data-[active=true]:bg-racing-red/10 data-[active=true]:text-racing-white"
                >
                  <Home size={20} />
                  <span>Visão Geral</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/tables")}
                  isActive={location.pathname === "/tables"}
                  tooltip="Tabelas"
                  className="text-racing-white hover:bg-racing-red/10 data-[active=true]:bg-racing-red/10 data-[active=true]:text-racing-white"
                >
                  <BarChart3 size={20} />
                  <span>Tabelas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/my-predictions")}
                  isActive={location.pathname === "/my-predictions"}
                  tooltip="Meus Palpites"
                  className="text-racing-white hover:bg-racing-red/10 data-[active=true]:bg-racing-red/10 data-[active=true]:text-racing-white"
                >
                  <Calendar size={20} />
                  <span>Meus Palpites</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => handleNavigation("/drivers-and-teams")}
                  isActive={location.pathname === "/drivers-and-teams"}
                  tooltip="Pilotos e Equipes"
                  className="text-racing-white hover:bg-racing-red/10 data-[active=true]:bg-racing-red/10 data-[active=true]:text-racing-white"
                >
                  <Users2 size={20} />
                  <span>Pilotos e Equipes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => handleNavigation("/admin/race-management")}
                    isActive={location.pathname === "/admin/race-management"}
                    tooltip="Gerenciar Corridas"
                    className="text-racing-white hover:bg-racing-red/10 data-[active=true]:bg-racing-red/10 data-[active=true]:text-racing-white"
                  >
                    <Settings size={20} />
                    <span>Gerenciar Corridas</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {username && (
        <SidebarFooter>
          <div className="p-4 border-t border-racing-silver/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-racing-red flex items-center justify-center text-racing-white font-bold">
                {username[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-racing-white text-sm font-medium">{username}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-racing-silver border-racing-silver/20 hover:bg-racing-red/10 hover:text-racing-white"
                onClick={() => handleNavigation('/profile')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-racing-silver border-racing-silver/20 hover:bg-racing-red hover:text-racing-white hover:border-transparent"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </SidebarFooter>
      )}
    </UISidebar>
  );
};

export default Sidebar;
