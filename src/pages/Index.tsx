import { DashboardCard } from "@/components/DashboardCard";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { Tractor, Users, ClipboardList, Wrench } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Index = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);

  // Buscar o company_id do usuário logado
  useEffect(() => {
    const getCompanyId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();
        
        if (profile?.company_id) {
          setCompanyId(profile.company_id);
        }
      }
    };
    getCompanyId();
  }, []);

  // Buscar maquinários
  const { data: machineryCount = 0 } = useQuery({
    queryKey: ['machinery-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('machinery')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Buscar usuários da empresa
  const { data: usersCount = 0 } = useQuery({
    queryKey: ['users-count', companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', companyId);
      return count || 0;
    },
    enabled: !!companyId,
  });

  // Buscar ordens de serviço pendentes
  const { data: ordersCount = 0 } = useQuery({
    queryKey: ['orders-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      return count || 0;
    },
  });

  // Buscar manutenções pendentes
  const { data: maintenanceCount = 0 } = useQuery({
    queryKey: ['maintenance-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('maintenance_schedules')
        .select('*', { count: 'exact', head: true })
        .is('last_maintenance_date', null);
      return count || 0;
    },
  });

  // Buscar alertas de manutenção
  const { data: alerts = [] } = useQuery({
    queryKey: ['maintenance-alerts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('maintenance_schedules')
        .select(`
          id,
          machinery_id,
          next_maintenance_date,
          machinery (name)
        `)
        .lte('next_maintenance_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('next_maintenance_date');
      
      return (data || []).map(schedule => ({
        title: "Manutenção Preventiva Necessária",
        description: `${schedule.machinery?.name} requer manutenção em ${new Date(schedule.next_maintenance_date).toLocaleDateString()}`,
        severity: "warning" as const,
      }));
    },
  });

  // Buscar dados do gráfico de manutenções
  const { data: chartData = [] } = useQuery({
    queryKey: ['maintenance-chart'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 3);

      const { data: maintenanceData } = await supabase
        .from('maintenance_history')
        .select('maintenance_date, maintenance_type')
        .gte('maintenance_date', startDate.toISOString());

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
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <MaintenanceAlert key={index} {...alert} />
        ))}
      </div>

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

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manutenções Preventivas vs. Corretivas</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="preventive" name="Preventivas" fill="#2F5233" />
              <Bar dataKey="corrective" name="Corretivas" fill="#FF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Index;