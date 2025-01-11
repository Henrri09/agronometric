import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Tractor, ClipboardList, DollarSign } from "lucide-react";
import { useCompanyId } from "./CompanyIdProvider";
import { toast } from "sonner";

export function DashboardMetrics() {
  const { companyId } = useCompanyId();

  const { data: usersCount = 0 } = useQuery({
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
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: machineryCount = 0 } = useQuery({
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
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: ordersCount = 0 } = useQuery({
    queryKey: ['pending-orders-count', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { count, error } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .eq('created_by', companyId);
      
      if (error) {
        console.error("Erro ao buscar ordens de serviço:", error);
        toast.error("Erro ao carregar quantidade de ordens de serviço");
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  const { data: economyGenerated = 0 } = useQuery({
    queryKey: ['economy-generated', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      
      const { data: maintenanceHistory, error } = await supabase
        .from('maintenance_history')
        .select('total_cost, maintenance_type')
        .gte('maintenance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error("Erro ao buscar histórico de manutenções:", error);
        toast.error("Erro ao calcular economia gerada");
        return 0;
      }

      const preventiveCosts = maintenanceHistory
        ?.filter(m => m.maintenance_type === 'preventive')
        .reduce((sum, m) => sum + (m.total_cost || 0), 0) || 0;

      return Math.round(preventiveCosts * 0.3);
    },
    enabled: !!companyId
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Usuários"
        value={usersCount}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      
      <DashboardCard
        title="Maquinários"
        value={machineryCount}
        icon={<Tractor className="h-4 w-4 text-muted-foreground" />}
      />
      
      <DashboardCard
        title="Ordens de Serviço"
        value={ordersCount}
        icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
      />
      
      <DashboardCard
        title="Economia Gerada"
        value={economyGenerated}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}