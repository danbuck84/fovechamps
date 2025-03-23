
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Use environment variables for Supabase configuration with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qrhuynyipwcgrdligbhq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaHV5bnlpcHdjZ3JkbGlnYmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDIyOTYsImV4cCI6MjA1NDg3ODI5Nn0.N973A98oFmZkC4t2oULlVj9bv7hUuIjR6O7zN_ojgZM';

console.log('Initializing Supabase client with URL:', supabaseUrl);

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage
  }
});

// Enhanced debug utility 
export const debugSupabase = () => {
  const authToken = localStorage.getItem('sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token');
  console.log("Supabase URL:", supabaseUrl);
  console.log("Auth Session available:", !!authToken);
  console.log("Auth Session token:", authToken ? 'Present' : 'Missing');
  
  // Check if we can make a basic query to test connection
  supabase.from('profiles').select('id').limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error("Supabase connection test failed:", error);
      } else {
        console.log("Supabase connection test successful:", data);
      }
    });
  
  return !!authToken;
};

// Call the debug function immediately to log connection state
debugSupabase();
