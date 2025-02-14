import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm, CompanyFormValues } from "@/components/super-admin/CompanyForm";
import { CompanyList } from "@/components/super-admin/CompanyList";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";

export function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Buscar empresas e perfis
      const { data: companiesData, error: companiesError } = await supabase
        .from("companies")
        .select(`
          *,
          profiles:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (companiesError) throw companiesError;

      // Buscar emails dos usuários
      const { data: userEmailsResponse, error: userEmailsError } = await supabase.functions.invoke('get-user-emails', {
        body: {}
      });

      if (userEmailsError) throw userEmailsError;

      // Mapear os emails para os perfis
      const companiesWithEmails = companiesData?.map(company => ({
        ...company,
        profiles: company.profiles?.map(profile => ({
          ...profile,
          email: userEmailsResponse.data[profile.id] || ''
        }))
      }));

      console.log("Fetched companies:", companiesWithEmails);
      setCompanies(companiesWithEmails || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error("Erro ao carregar empresas");
    }
  };

  const handleSubmit = async (data: CompanyFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingCompany) {
        const { error: updateError } = await supabase
          .from("companies")
          .update({
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            location: data.location,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCompany.id);

        if (updateError) throw updateError;

        toast.success("Empresa atualizada com sucesso!");
        handleCancel();
      } else {
        // Primeiro, criar a empresa
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            location: data.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select();

        if (companyError) throw companyError;

        const companyId = companyData[0].id;

        // Depois, convidar o usuário admin
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log("Session:", data);

        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/functions/v1/invite-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            email: data.adminEmail,
            fullName: data.adminName,
            role: 'admin',
            companyId: companyId
          })
        });

        if (!response.ok) {
          // Se falhar ao criar o usuário, remover a empresa
          await supabase.from('companies').delete().eq('id', companyId);
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao criar usuário administrador');
        }

        toast.success("Empresa criada com sucesso! Um email foi enviado para o administrador configurar sua senha.");
        handleCancel();
      }

      fetchCompanies();
    } catch (error: any) {
      console.error('Error managing company:', error);
      setError(error.message || "Erro ao gerenciar empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (company: any) => {
    console.log("Company to edit:", company);
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    try {
      setIsLoading(true);

      // Primeiro, buscar os perfis associados à empresa
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id")
        .eq('company_id', companyId);

      if (profilesError) throw profilesError;

      // Obter o token de autenticação
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Sessão não encontrada");

      // Para cada perfil, deletar o usuário do auth primeiro
      for (const profile of profiles || []) {
        // Deletar auth user usando edge function primeiro
        // Isso deve acionar os triggers para limpar as outras tabelas
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/functions/v1/delete-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            userId: profile.id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao deletar usuário');
        }

        // Aguardar um momento para os triggers processarem
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Depois que todos os usuários foram deletados, deletar a empresa
      const { error: companyError } = await supabase
        .from("companies")
        .delete()
        .eq('id', companyId);

      if (companyError) throw companyError;

      toast.success("Empresa excluída com sucesso!");
      fetchCompanies();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(error.message || "Erro ao excluir empresa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
    setError(null);
  };

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <CompanyList
            companies={companies}
            onRefresh={fetchCompanies}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCompany ? "Editar Empresa" : "Nova Empresa"}
            </DialogTitle>
          </DialogHeader>
          {error && (
            <MaintenanceAlert
              title="Erro"
              description={error}
              severity="error"
            />
          )}
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            defaultValues={editingCompany ? {
              name: editingCompany.name,
              cnpj: editingCompany.cnpj,
              address: editingCompany.address,
              location: editingCompany.location,
              adminName: editingCompany.profiles?.[0]?.full_name || "",
              adminEmail: editingCompany.profiles?.[0]?.email || ""
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}