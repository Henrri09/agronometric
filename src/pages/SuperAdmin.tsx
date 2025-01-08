import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, LineChart, Wallet, LifeBuoy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CompanyForm } from "@/components/super-admin/CompanyForm";
import { CompanyList } from "@/components/super-admin/CompanyList";
import { useNavigate } from "react-router-dom";

export default function SuperAdmin() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSuperAdminStatus();
    fetchCompanies();
  }, []);

  const checkSuperAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setIsSuperAdmin(roles?.role === "super_admin");
      if (roles?.role !== "super_admin") {
        navigate("/");
      }
    }
  };

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

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Empresas"
        description="Gerencie as empresas e seus administradores"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card 
          className="cursor-pointer transition-all duration-200 hover:bg-[#F2FCE2] hover:shadow-lg hover:border-[#7AE09A]" 
          onClick={() => navigate("/super-admin/financial")}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <Wallet className="h-12 w-12 mb-2 text-primary" />
            <h3 className="text-lg font-semibold">Gestão Financeira</h3>
            <p className="text-sm text-muted-foreground">Gerencie dados financeiros e notas fiscais</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:bg-[#F2FCE2] hover:shadow-lg hover:border-[#7AE09A]" 
          onClick={() => navigate("/super-admin/analytics")}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <LineChart className="h-12 w-12 mb-2 text-primary" />
            <h3 className="text-lg font-semibold">Analytics</h3>
            <p className="text-sm text-muted-foreground">Análise de receita e métricas</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all duration-200 hover:bg-[#F2FCE2] hover:shadow-lg hover:border-[#7AE09A]" 
          onClick={() => navigate("/super-admin/support")}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <LifeBuoy className="h-12 w-12 mb-2 text-primary" />
            <h3 className="text-lg font-semibold">Suporte</h3>
            <p className="text-sm text-muted-foreground">Gerencie tickets de suporte</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="hover:bg-[#7AE09A] hover:text-accent transition-colors"
        >
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
    </div>
  );
}