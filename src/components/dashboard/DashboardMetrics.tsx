import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Tractor, ClipboardList, DollarSign, Clock, Wrench, ArrowUpRight } from "lucide-react";
import { useCompanyId } from "./CompanyIdProvider";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DashboardMetrics() {
  const { companyId, isLoading: isLoadingCompany, error: companyError } = useCompanyId();

  const { data: usersCount = 0, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-count', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);
      
      if (error) {
        console.error("Erro ao buscar usuários:", error);
        toast.error("Erro ao carregar quantidade de usuários");
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: machineryCount = 0, isLoading: isLoadingMachinery } = useQuery({
    queryKey: ['machinery-count', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { count, error } = await supabase
        .from('machinery')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      if (error) {
        console.error("Erro ao buscar maquinários:", error);
        toast.error("Erro ao carregar quantidade de maquinários");
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: ordersCount = 0, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['pending-orders-count', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { count, error } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) {
        console.error("Erro ao buscar ordens de serviço:", error);
        toast.error("Erro ao carregar quantidade de ordens de serviço");
        throw error;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: economyGenerated = 0, isLoading: isLoadingEconomy } = useQuery({
    queryKey: ['economy-generated', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { data: maintenanceHistory, error } = await supabase
        .from('maintenance_history')
        .select(`
          total_cost,
          maintenance_type,
          machinery_id,
          machinery!inner(id)
        `)
        .eq('maintenance_type', 'preventive')
        .gte('maintenance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error("Erro ao buscar histórico de manutenções:", error);
        toast.error("Erro ao calcular economia gerada");
        throw error;
      }

      const preventiveCosts = maintenanceHistory
        ?.reduce((sum, m) => sum + (m.total_cost || 0), 0) || 0;

      return Math.round(preventiveCosts * 0.3);
    },
    enabled: !!companyId
  });

  const { data: mostDemandedMachinery, isLoading: isLoadingMostDemanded } = useQuery({
    queryKey: ['most-demanded-machinery', companyId],
    queryFn: async () => {
      if (!companyId) return { name: 'N/A', count: 0 };
      
      const { data, error } = await supabase
        .from('maintenance_history')
        .select(`
          machinery_id,
          machinery!inner(name)
        `)
        .gte('maintenance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error("Erro ao buscar maquinário mais demandado:", error);
        toast.error("Erro ao carregar maquinário mais demandado");
        throw error;
      }

      const counts = data.reduce((acc: Record<string, { name: string, count: number }>, curr) => {
        const name = curr.machinery?.name || 'N/A';
        if (!acc[curr.machinery_id]) {
          acc[curr.machinery_id] = { name, count: 0 };
        }
        acc[curr.machinery_id].count++;
        return acc;
      }, {});

      const mostDemanded = Object.values(counts).sort((a, b) => b.count - a.count)[0] || { name: 'N/A', count: 0 };
      return mostDemanded;
    },
    enabled: !!companyId
  });

  const { data: averageMaintenanceInterval = '-1 dias', isLoading: isLoadingInterval } = useQuery({
    queryKey: ['maintenance-interval', companyId],
    queryFn: async () => {
      if (!companyId) return '-1 dias';
      
      const { data, error } = await supabase
        .from('maintenance_history')
        .select('maintenance_date')
        .order('maintenance_date', { ascending: true });

      if (error) {
        console.error("Erro ao calcular intervalo médio:", error);
        toast.error("Erro ao calcular intervalo médio entre manutenções");
        throw error;
      }

      if (!data || data.length < 2) return '-1 dias';

      const intervals = data.slice(1).map((curr, i) => {
        const currDate = new Date(curr.maintenance_date);
        const prevDate = new Date(data[i].maintenance_date);
        return Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      });

      const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      return `${Math.round(averageInterval)} dias`;
    },
    enabled: !!companyId
  });

  const { data: totalMaintenances = 0, isLoading: isLoadingTotal } = useQuery({
    queryKey: ['total-maintenances', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { count, error } = await supabase
        .from('maintenance_history')
        .select('*', { count: 'exact', head: true })
        .gte('maintenance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error("Erro ao buscar total de manutenções:", error);
        toast.error("Erro ao carregar total de manutenções");
        throw error;
      }

      return count || 0;
    },
    enabled: !!companyId
  });

  if (companyError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>
          {companyError}. Por favor, tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Usuários do Sistema"
          value={usersCount}
          subtitle="Total de usuários cadastrados"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingUsers}
        />
        
        <DashboardCard
          title="Maquinários"
          value={machineryCount}
          subtitle="Total de equipamentos cadastrados"
          icon={<Tractor className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingMachinery}
        />
        
        <DashboardCard
          title="Ordens de Serviço"
          value={ordersCount}
          subtitle="Total de O.S. registradas"
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingOrders}
        />
        
        <DashboardCard
          title="Economia Gerada"
          value={economyGenerated}
          subtitle="Economia total estimada no período"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingEconomy}
          isCurrency
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Tempo Médio entre Manutenções"
          value={averageMaintenanceInterval}
          subtitle="Intervalo médio entre manutenções"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingInterval}
        />
        
        <DashboardCard
          title="Equipamento Mais Demandado"
          value={mostDemandedMachinery?.name || 'N/A'}
          subtitle={`${mostDemandedMachinery?.count || 0} manutenções`}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingMostDemanded}
        />
        
        <DashboardCard
          title="Total de Manutenções"
          value={totalMaintenances}
          subtitle="No período selecionado"
          icon={<ArrowUpRight className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoadingCompany || isLoadingTotal}
        />
      </div>
    </div>
  );
}