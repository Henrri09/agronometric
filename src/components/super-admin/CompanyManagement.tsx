import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/super-admin/CompanyForm";
import { CompanyList } from "@/components/super-admin/CompanyList";

export function CompanyManagement() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      toast.error(error.message || "Erro ao carregar empresas");
    }
  };

  const handleSubmit = async (data: any) => {
    try {
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

      const { error: rpcError } = await supabase.rpc("create_company_with_admin", {
        company_name: data.name,
        admin_email: data.adminEmail,
        admin_full_name: data.adminName
      });

      if (rpcError) throw rpcError;

      toast.success("Empresa criada com sucesso!");
      setIsDialogOpen(false);
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar empresa");
    }
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
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}