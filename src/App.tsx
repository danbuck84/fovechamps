
import React from 'react';
import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import routes from "./routes";
import { supabase } from "@/lib/supabase";
import { validateEnvVariables } from "@/utils/env-utils";

// Validate environment variables
validateEnvVariables();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <RouterProvider router={routes} />
        <Toaster position="top-right" />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
