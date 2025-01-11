import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Building2, ClipboardList, Activity } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const Index = () => {
  // Query para total de empresas
  const { data: companiesCount = 0, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['companies-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Erro ao buscar empresas:", error);
        toast.error("Erro ao carregar quantidade de empresas");
        throw error;
      }
      
      return count || 0;
    }
  });

  // Query para total de usuários
  const { data: usersCount = 0, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['total-users'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao carregar quantidade de usuários");
        throw error;
      }
      
      return count || 0;
    }
  });

  // Query para total de ordens de serviço
  const { data: ordersCount = 0, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['total-orders'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error("Erro ao buscar ordens de serviço:", error);
        toast.error("Erro ao carregar quantidade de ordens de serviço");
        throw error;
      }
      
      return count || 0;
    }
  });

  // Query para dados do gráfico de crescimento mensal
  const { data: monthlyGrowth = [], isLoading: isLoadingGrowth } = useQuery({
    queryKey: ['monthly-growth'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);
      
      const { data: companies, error } = await supabase
        .from('companies')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      if (error) {
        console.error("Erro ao buscar crescimento mensal:", error);
        toast.error("Erro ao carregar dados de crescimento");
        throw error;
      }

      const monthlyData: Record<string, number> = {};
      
      companies?.forEach(company => {
        const month = new Date(company.created_at).toLocaleString('pt-BR', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      });

      return Object.entries(monthlyData)
        .map(([month, count]) => ({
          month,
          empresas: count,
        }))
        .sort((a, b) => {
          const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          return months.indexOf(a.month.toLowerCase()) - months.indexOf(b.month.toLowerCase());
        });
    }
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoadingCompanies ? (
          <Skeleton className="h-32" />
        ) : (
          <DashboardCard
            title="Total de Empresas"
            value={companiesCount}
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          />
        )}
        
        {isLoadingUsers ? (
          <Skeleton className="h-32" />
        ) : (
          <DashboardCard
            title="Total de Usuários"
            value={usersCount}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
        )}
        
        {isLoadingOrders ? (
          <Skeleton className="h-32" />
        ) : (
          <DashboardCard
            title="Ordens de Serviço"
            value={ordersCount}
            icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
          />
        )}

        <DashboardCard
          title="Taxa de Atividade"
          value={ordersCount > 0 ? Math.round((ordersCount / usersCount) * 100) : 0}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crescimento Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {isLoadingGrowth ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="empresas" name="Novas Empresas" fill="#2F5233" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;