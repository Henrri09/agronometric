import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Tractor, ClipboardList, DollarSign } from "lucide-react";

import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanyId } from "@/hooks/useCompanyId";
import { apiUrl } from "@/utils/api";

export function DashboardMetrics() {
  const { companyId } = useCompanyId();

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

      // Busca apenas maquinários da empresa atual através do join com profiles
      const { count, error } = await supabase
        .from('machinery')
        .select('*, profiles!inner(*)', { count: 'exact', head: true })
        .eq('profiles.company_id', companyId)
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

      // Busca apenas ordens de serviço da empresa atual
      const { count, error } = await supabase
        .from('service_orders')
        .select('*, profiles!inner(*)', { count: 'exact', head: true })
        .eq('profiles.company_id', companyId)
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
    queryKey: ['metrics', companyId],
    queryFn: async () => {
      alert(companyId);
      const res = await fetch(`${apiUrl}/metrics?companyId=${companyId}`);
      const data = await res.json();
      return data;
    },
    enabled: !!companyId
  });

  if (!companyId) {
    return (
      <div className="text-center text-muted-foreground">
        Carregando dados da empresa...
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
          value={economyGenerated.totalCost}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      )}
    </div>
  );
}