
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

// List of terms to filter out from errors
const errorFilters = [
  'firebase', 
  'firestore', 
  'facebook.com/tr', 
  'unrecognized feature'
];

function App() {
  console.log("App: Rendering App component");
  
  // Call debug function to verify Supabase connection
  debugSupabase();

  // Add global error handler to suppress unwanted errors
  useEffect(() => {
    const originalErrorHandler = window.onerror;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // Override window.onerror to catch and filter errors
    window.onerror = function(message, source, lineno, colno, error) {
      const messageStr = String(message || '').toLowerCase();
      const sourceStr = String(source || '').toLowerCase();
      
      if (errorFilters.some(term => sourceStr.includes(term) || messageStr.includes(term))) {
        // Suppress matching errors
        console.warn('Suppressed error:', messageStr.substring(0, 150) + '...');
        return true;
      }
      
      return originalErrorHandler ? originalErrorHandler(message, source, lineno, colno, error) : false;
    };

    // Override console.error to filter unwanted errors
    console.error = function(...args) {
      const errorString = String(args[0] || '').toLowerCase();
      const secondArg = args[1] ? String(args[1]).toLowerCase() : '';
      
      if (errorFilters.some(term => 
        errorString.includes(term) || 
        secondArg.includes(term)
      )) {
        console.warn('Suppressed console error:', ...args.map(a => 
          typeof a === 'string' ? a.substring(0, 150) + '...' : a
        ));
        return;
      }
      originalConsoleError.apply(console, args);
    };
    
    // Override console.warn to filter unwanted warnings
    console.warn = function(...args) {
      const warnString = String(args[0] || '').toLowerCase();
      
      if (errorFilters.some(term => warnString.includes(term))) {
        // Just drop these warnings entirely
        return;
      }
      originalConsoleWarn.apply(console, args);
    };
    
    return () => {
      window.onerror = originalErrorHandler;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
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
