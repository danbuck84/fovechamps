
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
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/my-predictions",
    element: (
      <PrivateRoute>
        <MyPredictions />
      </PrivateRoute>
    ),
  },
  {
    path: "/tables",
    element: (
      <PrivateRoute>
        <Tables />
      </PrivateRoute>
    ),
  },
  {
    path: "/race/:raceId",
    element: (
      <PrivateRoute>
        <RaceResultsView />
      </PrivateRoute>
    ),
  },
  {
    path: "/race-results/:raceId",
    element: (
      <PrivateRoute>
        <RaceResults />
      </PrivateRoute>
    ),
  },
  {
    path: "/race-predictions/:raceId",
    element: (
      <PrivateRoute>
        <RacePredictions />
      </PrivateRoute>
    ),
  },
  {
    path: "/race-prediction/:raceId",
    element: (
      <PrivateRoute>
        <RacePredictions />
      </PrivateRoute>
    ),
  },
  {
    path: "/race-points/:raceId",
    element: (
      <PrivateRoute>
        <RaceResults />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/race-results/:raceId",
    element: (
      <PrivateRoute>
        <RaceResultsAdmin />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/race-management",
    element: (
      <PrivateRoute>
        <AdminRaceManagement />
      </PrivateRoute>
    ),
  },
  {
    path: "/drivers-and-teams",
    element: (
      <PrivateRoute>
        <DriversAndTeams />
      </PrivateRoute>
    ),
  },
  {
    path: "/driver/:id",
    element: (
      <PrivateRoute>
        <DriverDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/team/:id",
    element: (
      <PrivateRoute>
        <TeamDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default routes;
