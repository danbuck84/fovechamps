
import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import MyPredictions from "@/pages/MyPredictions";
import Tables from "@/pages/Tables";
import RaceResultsView from "@/pages/RaceResultsView";
import RaceResults from "@/pages/RaceResults";
import RacePredictions from "@/pages/RacePredictions";
import RaceResultsAdmin from "@/pages/RaceResultsAdmin";
import AdminRaceManagement from "@/pages/AdminRaceManagement";
import DriversAndTeams from "@/pages/DriversAndTeams";
import DriverDetail from "@/pages/DriverDetail";
import TeamDetail from "@/pages/TeamDetail";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/components/auth/PrivateRoute";
import MainLayout from "@/components/layout/MainLayout";

// Componente que envolve rotas privadas com o SidebarProvider
const PrivateRouteWithSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <PrivateRoute>
      <WrappedLayout>
        {children}
      </WrappedLayout>
    </PrivateRoute>
  );
};

// Componente que envolve MainLayout com SidebarProvider
const WrappedLayout = ({ children, username = "", isAdmin = false }: { 
  children: React.ReactNode;
  username?: string;
  isAdmin?: boolean;
}) => {
  return (
    <SidebarProvider defaultOpen={true}>
      <MainLayout username={username} isAdmin={isAdmin}>
        {children}
      </MainLayout>
    </SidebarProvider>
  );
};

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouteWithSidebar>
        <Dashboard />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRouteWithSidebar>
        <Profile />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/my-predictions",
    element: (
      <PrivateRouteWithSidebar>
        <MyPredictions />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/tables",
    element: (
      <PrivateRouteWithSidebar>
        <Tables />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/race/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RaceResultsView />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/race-results/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RaceResults />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/race-predictions/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RacePredictions />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/race-prediction/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RacePredictions />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/race-points/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RaceResults />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/admin/race-results/:raceId",
    element: (
      <PrivateRouteWithSidebar>
        <RaceResultsAdmin />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/admin/race-management",
    element: (
      <PrivateRouteWithSidebar>
        <AdminRaceManagement />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/drivers-and-teams",
    element: (
      <PrivateRouteWithSidebar>
        <DriversAndTeams />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/driver/:id",
    element: (
      <PrivateRouteWithSidebar>
        <DriverDetail />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "/team/:id",
    element: (
      <PrivateRouteWithSidebar>
        <TeamDetail />
      </PrivateRouteWithSidebar>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
