import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardCard } from "@/components/DashboardCard";
import { Tractor, Users, ClipboardList, Wrench } from "lucide-react";

export function DashboardStats() {
  const { data: machineryCount = 0 } = useQuery({
    queryKey: ['machineryCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('machinery')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: usersCount = 0 } = useQuery({
    queryKey: ['usersCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: ordersCount = 0 } = useQuery({
    queryKey: ['ordersCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: maintenanceCount = 0 } = useQuery({
    queryKey: ['maintenanceCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('maintenance_schedules')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      return count || 0;
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Maquinários"
        value={machineryCount}
        icon={<Tractor className="h-4 w-4 text-primary" />}
      />
      <DashboardCard
        title="Usuários"
        value={usersCount}
        icon={<Users className="h-4 w-4 text-primary" />}
      />
      <DashboardCard
        title="Ordens de Serviço"
        value={ordersCount}
        icon={<ClipboardList className="h-4 w-4 text-primary" />}
      />
      <DashboardCard
        title="Manutenções Pendentes"
        value={maintenanceCount}
        icon={<Wrench className="h-4 w-4 text-primary" />}
      />
    </div>
  );
}