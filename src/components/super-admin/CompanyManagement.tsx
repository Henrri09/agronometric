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
      const { data, error } = await supabase
        .from("companies")
        .select(`
          *,
          profiles:profiles(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Fetched companies:", data);
      setCompanies(data || []);
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
            location: data.location
          })
          .eq('id', editingCompany.id);

        if (updateError) throw updateError;
        
        toast.success("Empresa atualizada com sucesso!");
        handleCancel();
      } else {
        // Criar nova empresa
        const { error: rpcError } = await supabase.functions.invoke('create-company', {
          body: {
            companyName: data.name,
            adminEmail: data.adminEmail,
            adminName: data.adminName
          }
        });

        if (rpcError) {
          console.error('Error creating company:', rpcError);
          setError(rpcError.message || "Erro ao criar empresa");
          setIsLoading(false);
          return;
        }

        toast.success("Empresa criada com sucesso!");
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
    setEditingCompany(company);
    setIsDialogOpen(true);
  };

  const handleDelete = async (companyId: string) => {
    try {
      setIsLoading(true);
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
              adminEmail: ""
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}