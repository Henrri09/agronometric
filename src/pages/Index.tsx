import { DashboardCard } from "@/components/DashboardCard";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { Tractor, Users, ClipboardList, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Index = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Buscar o company_id do usuário logado
  useEffect(() => {
    const getCompanyId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("Usuário não encontrado");
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          toast.error("Erro ao carregar dados da empresa");
          return;
        }

        if (profile?.company_id) {
          console.log("Company ID encontrado:", profile.company_id);
          setCompanyId(profile.company_id);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        toast.error("Erro ao carregar dados do usuário");
      }
    };

    getCompanyId();
  }, []);

  // Buscar total de usuários da empresa
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

  // Buscar total de maquinários
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

  // Buscar ordens de serviço pendentes
  const { data: ordersCount = 0 } = useQuery({
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
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!companyId
  });

  // Calcular economia gerada (baseado no histórico de manutenções)
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

      if (!maintenanceHistory) return 0;

      // Cálculo simplificado: economia é 30% do custo total de manutenções preventivas
      const preventiveCosts = maintenanceHistory
        .filter(m => m.maintenance_type === 'preventive')
        .reduce((sum, m) => sum + (m.total_cost || 0), 0);

      return Math.round(preventiveCosts * 0.3);
    },
    enabled: !!companyId
  });

  // Buscar alertas de manutenção
  const { data: alerts = [] } = useQuery({
    queryKey: ['maintenance-alerts', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          id,
          machinery_id,
          next_maintenance_date,
          machinery (name)
        `)
        .lte('next_maintenance_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('next_maintenance_date');
      
      if (error) {
        console.error("Erro ao buscar alertas:", error);
        toast.error("Erro ao carregar alertas de manutenção");
        return [];
      }

      return (data || []).map(schedule => ({
        title: "Manutenção Preventiva Necessária",
        description: `${schedule.machinery?.name} requer manutenção em ${new Date(schedule.next_maintenance_date).toLocaleDateString()}`,
        severity: "warning" as const,
      }));
    },
    enabled: !!companyId
  });

  // Buscar dados do gráfico de manutenções
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Visualize os principais indicadores do seu negócio
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <MaintenanceAlert key={index} {...alert} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Usuários"
          value={usersCount}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Maquinários"
          value={machineryCount}
          icon={<Tractor className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Ordens de Serviço"
          value={ordersCount}
          icon={<ClipboardList className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Economia Gerada"
          value={economyGenerated}
          icon={<DollarSign className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Manutenções Preventivas vs. Corretivas</h2>
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
        </div>

        <div className="bg-card p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status dos Equipamentos</h2>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Em desenvolvimento</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
