import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Tractor, ClipboardList, DollarSign } from "lucide-react";
import { useCompanyId } from "./CompanyIdProvider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardMetrics() {
  const { companyId } = useCompanyId();
  console.log("CompanyId no DashboardMetrics:", companyId);

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

  if (!companyId) {
    console.error("CompanyId não encontrado");
    return (
      <div className="text-center">
        <div className="text-muted-foreground mb-2">
          Erro ao carregar dados da empresa
        </div>
        <div className="text-sm text-red-500">
          ID da empresa não encontrado. Por favor, verifique se você está logado corretamente.
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoadingUsers ? (
        <Skeleton className="h-32" />
      ) : (
        <DashboardCard
          title="Total de Usuários"
          value={usersCount}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
      )}
      
      {isLoadingMachinery ? (
        <Skeleton className="h-32" />
      ) : (
        <DashboardCard
          title="Maquinários"
          value={machineryCount}
          icon={<Tractor className="h-4 w-4 text-muted-foreground" />}
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
      
      {isLoadingEconomy ? (
        <Skeleton className="h-32" />
      ) : (
        <DashboardCard
          title="Economia Gerada"
          value={economyGenerated}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      )}
    </div>
  );
}