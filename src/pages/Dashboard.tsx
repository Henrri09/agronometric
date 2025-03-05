import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Wrench, ClipboardList, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/components/dashboard/CompanyIdProvider";
import type { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type MaintenanceHistory = Database['public']['Tables']['maintenance_history']['Row'];
type ServiceOrder = Database['public']['Tables']['service_orders']['Row'] & {
  maintenance_history?: { total_cost: number | null }[];
};
type Machine = Database['public']['Tables']['machinery']['Row'];

export default function Dashboard() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const { companyId } = useCompanyId();

  useEffect(() => {
    console.log('companyId', companyId);
    const fetchData = async () => {
      if (!companyId) return;

      try {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', companyId);

        if (usersError) {
          console.error('Erro ao buscar usuários:', usersError);
          return;
        }

        const { data: orders, error: ordersError } = await supabase
          .from('service_orders')
          .select(`
            *,
            machinery!inner(
              company_id
            ),
            maintenance_history (
              total_cost
            )
          `)
          .eq('machinery.company_id', companyId);

        if (ordersError) {
          console.error('Erro ao buscar ordens de serviço:', ordersError);
          return;
        }

        const { data: machines, error: machinesError } = await supabase
          .from('machinery')
          .select('*')
          .eq('company_id', companyId);

        if (machinesError) {
          console.error('Erro ao buscar maquinários:', machinesError);
          return;
        }

        setUsers(users || []);
        setOrders(orders || []);
        setMachines(machines || []);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [companyId]);

  const calculateTotalCost = (orders: ServiceOrder[]) => {
    return orders.reduce((acc, order) => {
      const maintenanceCost = order.maintenance_history?.[0]?.total_cost || 0;
      return acc + maintenanceCost;
    }, 0);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Painel de Controle"
        description="Visualize os principais indicadores do seu negócio"
      />

      <MaintenanceAlert
        title="Manutenção Preventiva"
        description="Há 3 equipamentos que precisam de manutenção preventiva esta semana."
        severity="warning"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <DashboardCard
          title="Total de Usuários"
          value={users?.length}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />

        <DashboardCard
          title="Maquinários"
          value={machines?.length}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
        />

        <DashboardCard
          title="Ordens de Serviço"
          value={orders?.length}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />

        <DashboardCard
          title="Economia Gerada"
          value={calculateTotalCost(orders)}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manutenções Preventivas vs Corretivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de Manutenções
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de Status
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}