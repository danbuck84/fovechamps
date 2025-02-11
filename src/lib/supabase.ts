
import { createClient } from "@supabase/supabase-js";

// Aguarda 1 segundo para garantir que as variáveis de ambiente estejam disponíveis
await new Promise(resolve => setTimeout(resolve, 1000));

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error("VITE_SUPABASE_URL não está definido");
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("VITE_SUPABASE_ANON_KEY não está definido");
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Log para debug
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
