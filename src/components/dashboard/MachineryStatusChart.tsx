import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanyId } from "@/hooks/useCompanyId";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#2F5233', '#FF4444', '#FFA500'];

export function MachineryStatusChart() {
  const { companyId } = useCompanyId();

  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['machinery-status', companyId],
    queryFn: async () => {
      if (!companyId) return [];

      const { data: machineryData, error } = await supabase
        .from('machinery')
        .select(`
          status,
          profiles!inner(company_id)
        `)
        .eq('profiles.company_id', companyId);

      if (error) {
        console.error("Erro ao buscar status dos equipamentos:", error);
        toast.error("Erro ao carregar status dos equipamentos");
        throw error;
      }

      const statusCount: Record<string, number> = {
        active: 0,
        maintenance: 0,
        inactive: 0
      };

      machineryData?.forEach(machinery => {
        const status = machinery.status || 'inactive';
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      return Object.entries(statusCount).map(([status, value]) => ({
        name: status === 'active' ? 'Ativo' :
          status === 'maintenance' ? 'Em Manutenção' : 'Inativo',
        value
      }));
    },
    enabled: !!companyId
  });

  if (!companyId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status dos Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Carregando dados da empresa...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status dos Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Equipamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}