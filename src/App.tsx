
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from "sonner";

import routes from "./routes";
import { supabase } from "@/lib/supabase";
import { validateEnvVariables } from "@/utils/env-utils";

// Validate environment variables
validateEnvVariables();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <RouterProvider router={routes} />
      <Toaster position="top-right" />
    </SessionContextProvider>
  );
}

export default App;
