
import React from 'react';
import { createBrowserRouter } from "react-router-dom";

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
import MainLayout from "@/components/layout/MainLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <MainLayout>
          <Profile />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/my-predictions",
    element: (
      <PrivateRoute>
        <MainLayout>
          <MyPredictions />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/tables",
    element: (
      <PrivateRoute>
        <MainLayout>
          <Tables />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/race/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RaceResultsView />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/race-results/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RaceResults />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/race-predictions/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RacePredictions />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/race-prediction/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RacePredictions />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/race-points/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RaceResults />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/race-results/:raceId",
    element: (
      <PrivateRoute>
        <MainLayout>
          <RaceResultsAdmin />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/race-management",
    element: (
      <PrivateRoute>
        <MainLayout>
          <AdminRaceManagement />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/drivers-and-teams",
    element: (
      <PrivateRoute>
        <MainLayout>
          <DriversAndTeams />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/driver/:id",
    element: (
      <PrivateRoute>
        <MainLayout>
          <DriverDetail />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "/team/:id",
    element: (
      <PrivateRoute>
        <MainLayout>
          <TeamDetail />
        </MainLayout>
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
