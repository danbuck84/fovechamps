
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

// Comprehensive list of all error patterns to suppress
const errorFilters = [
  'firebase', 
  'firestore', 
  'facebook.com', 
  'unrecognized feature',
  'feature',
  'sentry',
  'tr?id=',
  'facebook',
  'pixel',
  'preloaded',
  'tr?',
  'resource',
  'was preloaded',
  'vr',
  'ambient-light-sensor',
  'battery'
];

function App() {
  console.log("App: Rendering App component");
  
  // Call debug function to verify Supabase connection
  debugSupabase();

  // Add global error handler to suppress unwanted errors
  useEffect(() => {
    // Store original console methods
    const originalErrorHandler = window.onerror;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    // Override window.onerror to completely suppress matching errors
    window.onerror = function(message, source, lineno, colno, error) {
      const messageStr = String(message || '').toLowerCase();
      const sourceStr = String(source || '').toLowerCase();
      
      if (errorFilters.some(term => sourceStr.includes(term) || messageStr.includes(term))) {
        // Completely suppress - don't even log a warning
        return true;
      }
      
      return originalErrorHandler ? originalErrorHandler(message, source, lineno, colno, error) : false;
    };

    // Aggressively filter console.error
    console.error = function(...args) {
      const errorString = String(args[0] || '').toLowerCase();
      const secondArg = args[1] ? String(args[1]).toLowerCase() : '';
      
      // Check if any argument contains filtered terms
      const shouldFilter = args.some(arg => {
        if (arg === null || arg === undefined) return false;
        const argStr = String(arg).toLowerCase();
        return errorFilters.some(term => argStr.includes(term));
      });
      
      if (shouldFilter || errorFilters.some(term => errorString.includes(term) || secondArg.includes(term))) {
        // Drop the error completely
        return;
      }
      
      originalConsoleError.apply(console, args);
    };
    
    // Filter console.warn
    console.warn = function(...args) {
      const shouldFilter = args.some(arg => {
        if (arg === null || arg === undefined) return false;
        const argStr = String(arg).toLowerCase();
        return errorFilters.some(term => argStr.includes(term));
      });
      
      if (shouldFilter) {
        // Drop the warning completely
        return;
      }
      
      originalConsoleWarn.apply(console, args);
    };
    
    // Even filter console.log for Facebook related messages
    console.log = function(...args) {
      const shouldFilter = args.some(arg => {
        if (arg === null || arg === undefined) return false;
        const argStr = String(arg).toLowerCase();
        return argStr.includes('facebook') || argStr.includes('tr?id=') || argStr.includes('pixel');
      });
      
      if (shouldFilter) {
        // Drop the log completely
        return;
      }
      
      originalConsoleLog.apply(console, args);
    };
    
    // Block Facebook script loading
    const blockFacebookScripts = () => {
      const scripts = document.querySelectorAll('script[src*="facebook"], link[href*="facebook"]');
      scripts.forEach(script => script.remove());
    };
    
    // Call once on load and also set up a MutationObserver
    blockFacebookScripts();
    
    // Set up observer to remove Facebook scripts as they appear
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            // Check if node is an Element before accessing element-specific properties
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (
                (element.nodeName === 'SCRIPT' && element.getAttribute('src')?.includes('facebook')) ||
                (element.nodeName === 'LINK' && element.getAttribute('href')?.includes('facebook'))
              ) {
                element.remove();
              }
            }
          }
        }
      }
    });
    
    // Start observing
    observer.observe(document, { childList: true, subtree: true });
    
    return () => {
      window.onerror = originalErrorHandler;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;
      observer.disconnect();
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
