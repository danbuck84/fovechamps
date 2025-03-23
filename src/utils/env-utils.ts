
// Check if environment variables are defined and provide helpful error messages
export const validateEnvVariables = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    console.warn('VITE_SUPABASE_URL environment variable is missing. Using default URL.');
  }
  
  if (!supabaseAnonKey) {
    console.warn('VITE_SUPABASE_ANON_KEY environment variable is missing. Using default key.');
  }
};
