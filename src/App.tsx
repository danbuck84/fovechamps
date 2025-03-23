
import React, { Suspense, useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import routes from "./routes";
import { supabase, debugSupabase } from "@/lib/supabase";
import { validateEnvVariables } from "@/utils/env-utils";

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

  // Add global error handler to suppress Firebase-related errors
  useEffect(() => {
    const originalErrorHandler = window.onerror;
    const originalConsoleError = console.error;

    // Override window.onerror to catch and filter errors
    window.onerror = function(message, source, lineno, colno, error) {
      if (
        (source && (source.includes('firebase') || source.includes('firestore'))) || 
        (message && (String(message).includes('firebase') || String(message).includes('firestore')))
      ) {
        // Suppress Firebase-related errors
        console.warn('Suppressed Firebase-related error:', message);
        return true;
      }
      
      return originalErrorHandler ? originalErrorHandler(message, source, lineno, colno, error) : false;
    };

    // Override console.error to filter Firebase warnings
    console.error = function(...args) {
      const errorString = String(args[0] || '');
      if (
        errorString.includes('firebase') || 
        errorString.includes('firestore') ||
        (args[1] && String(args[1]).includes('firebase')) ||
        (args[1] && String(args[1]).includes('firestore'))
      ) {
        console.warn('Suppressed Firebase console error:', ...args);
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    return () => {
      window.onerror = originalErrorHandler;
      console.error = originalConsoleError;
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <Suspense fallback={
          <div className="min-h-screen bg-racing-black flex items-center justify-center">
            <p className="text-racing-white">Carregando aplicação...</p>
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
