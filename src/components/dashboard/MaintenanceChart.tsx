import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyId } from "./CompanyIdProvider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MaintenanceChart() {
  const { companyId, isLoading: isLoadingCompany, error: companyError } = useCompanyId();

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['maintenance-chart', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const { data: maintenanceData, error } = await supabase
        .from('maintenance_history')
        .select(`
          maintenance_date,
          maintenance_type,
          machinery_id,
          machinery!inner(
            id,
            profiles!inner(company_id)
          )
        `)
        .eq('machinery.profiles.company_id', companyId)
        .gte('maintenance_date', startDate.toISOString());

      if (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
        toast.error("Erro ao carregar dados do gráfico");
        throw error;
      }

      const monthlyData: Record<string, { preventive: number; corrective: number }> = {};
      
      maintenanceData?.forEach(maintenance => {
        const month = new Date(maintenance.maintenance_date).toLocaleString('pt-BR', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { preventive: 0, corrective: 0 };
        }
        if (maintenance.maintenance_type === 'preventive') {
          monthlyData[month].preventive++;
        } else if (maintenance.maintenance_type === 'corrective') {
          monthlyData[month].corrective++;
        }
      });

      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          preventive: data.preventive,
          corrective: data.corrective,
        }))
        .sort((a, b) => {
          const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          return months.indexOf(a.month.toLowerCase()) - months.indexOf(b.month.toLowerCase());
        });
    },
    enabled: !!companyId
  });

  if (companyError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manutenções Preventivas vs. Corretivas</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar dados</AlertTitle>
            <AlertDescription>{companyError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingCompany || isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manutenções Preventivas vs. Corretivas</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manutenções Preventivas vs. Corretivas</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sem dados disponíveis</AlertTitle>
            <AlertDescription>
              Não há registros de manutenção para o período selecionado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manutenções Preventivas vs. Corretivas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="preventive" name="Preventivas" fill="#2F5233" />
              <Bar dataKey="corrective" name="Corretivas" fill="#FF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
