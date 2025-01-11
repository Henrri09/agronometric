import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyId } from "./CompanyIdProvider";
import { toast } from "sonner";

export function MaintenanceChart() {
  const { companyId } = useCompanyId();

  const { data: chartData = [] } = useQuery({
    queryKey: ['maintenance-chart', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const { data: maintenanceData, error } = await supabase
        .from('maintenance_history')
        .select('maintenance_date, maintenance_type')
        .gte('maintenance_date', startDate.toISOString());

      if (error) {
        console.error("Erro ao buscar dados do gráfico:", error);
        toast.error("Erro ao carregar dados do gráfico");
        return [];
      }

      const monthlyData: Record<string, { preventive: number; corrective: number }> = {};
      
      maintenanceData?.forEach(maintenance => {
        const month = new Date(maintenance.maintenance_date).toLocaleString('default', { month: 'short' });
        if (!monthlyData[month]) {
          monthlyData[month] = { preventive: 0, corrective: 0 };
        }
        if (maintenance.maintenance_type === 'preventive') {
          monthlyData[month].preventive++;
        } else if (maintenance.maintenance_type === 'corrective') {
          monthlyData[month].corrective++;
        }
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        preventive: data.preventive,
        corrective: data.corrective,
      }));
    },
    enabled: !!companyId
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manutenções Preventivas vs. Corretivas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <BarChart width={500} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="preventive" name="Preventivas" fill="#2F5233" />
            <Bar dataKey="corrective" name="Corretivas" fill="#FF4444" />
          </BarChart>
        </div>
      </CardContent>
    </Card>
  );
}