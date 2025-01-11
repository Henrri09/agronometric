import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type CompanyIdContextType = {
  companyId: string | null;
};

const CompanyIdContext = createContext<CompanyIdContextType>({ companyId: null });

export const useCompanyId = () => useContext(CompanyIdContext);

export function CompanyIdProvider({ children }: { children: React.ReactNode }) {
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const getCompanyId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error("Usuário não encontrado");
          toast.error("Usuário não encontrado");
          return;
        }

        console.log("User ID:", user.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          toast.error("Erro ao carregar dados da empresa");
          return;
        }

        if (!profile?.company_id) {
          console.error("Company ID não encontrado para o usuário");
          toast.error("Empresa não encontrada para este usuário");
          return;
        }

        console.log("Company ID encontrado:", profile.company_id);
        setCompanyId(profile.company_id);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
      }
    };

    getCompanyId();
  }, []);

  return (
    <CompanyIdContext.Provider value={{ companyId }}>
      {children}
    </CompanyIdContext.Provider>
  );
}