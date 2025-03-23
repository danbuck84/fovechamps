
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Use environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qrhuynyipwcgrdligbhq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyaHV5bnlpcHdjZ3JkbGlnYmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzMDIyOTYsImV4cCI6MjA1NDg3ODI5Nn0.N973A98oFmZkC4t2oULlVj9bv7hUuIjR6O7zN_ojgZM';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage
  }
});
