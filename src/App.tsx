
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import Tables from "./pages/Tables";
import RaceResultsView from "./pages/RaceResultsView";
import RaceResultsAdmin from "./pages/RaceResultsAdmin";
import RacePredictions from "./pages/RacePredictions";
import AdminRaceManagement from "./pages/AdminRaceManagement";
import DriversAndTeams from "./pages/DriversAndTeams";
import DriverDetail from "./pages/DriverDetail";
import TeamDetail from "./pages/TeamDetail";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyPredictions from "./pages/MyPredictions";
import MainLayout from "./components/layout/MainLayout";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./pages/NotFound";
import { supabase } from "@/lib/supabase";
import { Toaster } from "sonner";

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing.');
}

const router = createBrowserRouter([
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

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </SessionContextProvider>
  );
}

export default App;
