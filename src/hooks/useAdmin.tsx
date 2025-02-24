
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('Erro ao verificar status de admin:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
      
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
};
