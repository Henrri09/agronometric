import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CompanyIdContextType = {
  companyId: string | null;
  isLoading: boolean;
  error: string | null;
};

const CompanyIdContext = createContext<CompanyIdContextType>({
  companyId: null,
  isLoading: true,
  error: null
});

export const useCompanyId = () => useContext(CompanyIdContext);

export function CompanyIdProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const getCompanyId = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw new Error("Erro ao buscar usuário");
        }

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          throw new Error("Erro ao buscar perfil do usuário");
        }

        if (!profile?.company_id) {
          throw new Error("Empresa não encontrada para este usuário");
        }

        if (isMounted) {
          setCompanyId(profile.company_id);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
          setError(errorMessage);
          toast.error(errorMessage);
          console.error("Erro ao carregar dados da empresa:", err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    getCompanyId();

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (isMounted) {
        getCompanyId();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <CompanyIdContext.Provider value={{ companyId, isLoading, error }}>
      {children}
    </CompanyIdContext.Provider>
  );
}