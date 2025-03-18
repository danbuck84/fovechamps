
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createClient } from '@supabase/supabase-js'
import { SessionContextProvider } from '@supabase/auth-helpers-react'

import Tables from "./pages/Tables";
import RaceResultsView from "./pages/RaceResultsView";
import RaceResultsAdmin from "./pages/RaceResultsAdmin";
import AdminRaceManagement from "./pages/AdminRaceManagement";
import DriversAndTeams from "./pages/DriversAndTeams";
import DriverDetail from "./pages/DriverDetail";
import TeamDetail from "./pages/TeamDetail";

// Use import.meta.env for Vite environment variables instead of process.env
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <DriversAndTeams />,
  },
  {
    path: "/tables",
    element: <Tables />,
  },
  {
    path: "/race/:raceId",
    element: <RaceResultsView />,
  },
  {
    path: "/admin/race-results/:raceId",
    element: <RaceResultsAdmin />,
  },
  {
    path: "/admin/race-management",
    element: <AdminRaceManagement />,
  },
  {
    path: "/drivers-and-teams",
    element: <DriversAndTeams />,
  },
  {
    path: "/driver/:id",
    element: <DriverDetail />,
  },
  {
    path: "/team/:id",
    element: <TeamDetail />,
  },
]);

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <RouterProvider router={router} />
    </SessionContextProvider>
  );
}

export default App;
