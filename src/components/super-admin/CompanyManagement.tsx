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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.functions.invoke('create-company', {
        body: {
          companyName: data.name,
          adminEmail: data.adminEmail,
          adminName: data.adminName
        }
      });

      if (error) {
        // Try to parse the error message from the response body
        let errorMessage = error.message;
        try {
          const errorBody = JSON.parse(error.message);
          if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch {
          // If parsing fails, use the original error message
        }
        setError(errorMessage);
        return;
      }

      toast.success("Empresa criada com sucesso!");
      setIsDialogOpen(false);
      fetchCompanies();
    } catch (error: any) {
      console.error('Error creating company:', error);
      setError(error.message || "Erro ao criar empresa");
    } finally {
      setIsLoading(false);
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

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setError(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isLoading}
            error={error}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}