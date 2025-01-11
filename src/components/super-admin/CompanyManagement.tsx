import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm, CompanyFormValues } from "@/components/super-admin/CompanyForm";
import { CompanyList } from "@/components/super-admin/CompanyList";

export function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select(`
          *,
          profiles:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error: any) {
      console.error('Error fetching companies:', error);
      toast.error(error.message || "Erro ao carregar empresas");
    }
  };

  const handleSubmit = async (data: CompanyFormValues) => {
    try {
      if (editingCompany) {
        // Atualizar empresa existente
        const { error: updateError } = await supabase
          .from("companies")
          .update({
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            location: data.location
          })
          .eq('id', editingCompany.id);

        if (updateError) throw updateError;
        
        toast.success("Empresa atualizada com sucesso!");
      } else {
        // Criar nova empresa
        const { data: company, error: companyError } = await supabase
          .from("companies")
          .insert({
            name: data.name,
            cnpj: data.cnpj,
            address: data.address,
            location: data.location
          })
          .select()
          .single();

        if (companyError) throw companyError;

        // Criar perfil do administrador usando a edge function
        const { error: rpcError } = await supabase.functions.invoke('create-company', {
          body: {
            companyName: data.name,
            adminEmail: data.adminEmail,
            adminName: data.adminName
          }
        });

        if (rpcError) throw rpcError;

        toast.success("Empresa criada com sucesso!");
      }

      setIsDialogOpen(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (error: any) {
      console.error('Error managing company:', error);
      toast.error(error.message || "Erro ao gerenciar empresa");
    }
  };

  const handleEdit = (company: any) => {
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    try {
      const { error } = await supabase
        .from("companies")
        .delete()
        .eq('id', companyId);

      if (error) throw error;

      toast.success("Empresa excluída com sucesso!");
      fetchCompanies();
    } catch (error: any) {
      console.error('Error deleting company:', error);
      toast.error(error.message || "Erro ao excluir empresa");
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingCompany(null);
  };

  return (
    <>
      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
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
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            defaultValues={editingCompany ? {
              name: editingCompany.name,
              cnpj: editingCompany.cnpj,
              address: editingCompany.address,
              location: editingCompany.location,
              adminName: editingCompany.profiles?.[0]?.full_name || "",
              adminEmail: ""
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}