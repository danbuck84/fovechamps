
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

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  username: string;
  isAdmin?: boolean;
}

const Sidebar = ({ username, isAdmin = false }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
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
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/dashboard"}
                  tooltip="Visão Geral"
                >
                  <RouterLink to="/dashboard">
                    <Home size={20} />
                    <span>Visão Geral</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/tables"}
                  tooltip="Tabelas"
                >
                  <RouterLink to="/tables">
                    <BarChart3 size={20} />
                    <span>Tabelas</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/my-predictions"}
                  tooltip="Meus Palpites"
                >
                  <RouterLink to="/my-predictions">
                    <Calendar size={20} />
                    <span>Meus Palpites</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/drivers-and-teams"}
                  tooltip="Pilotos e Equipes"
                >
                  <RouterLink to="/drivers-and-teams">
                    <Users2 size={20} />
                    <span>Pilotos e Equipes</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === "/admin/race-management"}
                    tooltip="Gerenciar Corridas"
                  >
                    <RouterLink to="/admin/race-management">
                      <Settings size={20} />
                      <span>Gerenciar Corridas</span>
                    </RouterLink>
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
                onClick={() => navigate('/profile')}
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
