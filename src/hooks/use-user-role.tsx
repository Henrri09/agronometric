import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useUserRole() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No session found");
          setLoading(false);
          return;
        }

        console.log("Checking roles for user:", session.user.id);
        
        const { data: userRole, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user role:", error);
          toast.error("Erro ao carregar permissões do usuário");
          return;
        }

        console.log("User role response:", userRole);
        
        if (userRole?.role) {
          setIsAdmin(userRole.role === 'admin');
          setIsSuperAdmin(userRole.role === 'super_admin');
          console.log("Role set - Admin:", userRole.role === 'admin', "SuperAdmin:", userRole.role === 'super_admin');
        } else {
          console.log("No role found for user");
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error("Error in checkUserRole:", error);
        toast.error("Erro ao verificar status do usuário");
      } finally {
        setLoading(false);
      }
    };

    // Check initial role
    checkUserRole();

    // Monitor authentication changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, isSuperAdmin, loading };
}