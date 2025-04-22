
import React, { Suspense } from 'react';
import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import routes from "./routes";
import { supabase, debugSupabase } from "@/lib/supabase";
import { validateEnvVariables } from "@/utils/env-utils";
import "./App.css";

// Validate environment variables
validateEnvVariables();

console.log("App: Initializing");

// Create a client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 1000, // 10 seconds
    },
    mutations: {
      onSettled: (_, error) => {
        if (error) {
          console.error("React Query mutation error:", error);
        }
      }
    }
  },
});

function App() {
  console.log("App: Rendering App component");
  
  // Call debug function to verify Supabase connection
  debugSupabase();
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Suspense fallback={
          <div className="min-h-screen bg-fove-navy flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-fove-white text-2xl font-bold mb-2">FoVe Champs</h2>
              <p className="text-fove-silver">Carregando aplicação...</p>
            </div>
          </div>
        }>
          <RouterProvider router={routes} />
        </Suspense>
        <Toaster position="top-right" />
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
