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

const Index = () => {
  // Fetch machinery count
  const { data: machineryCount = 0 } = useQuery({
    queryKey: ['machineryCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('machinery')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch users count
  const { data: usersCount = 0 } = useQuery({
    queryKey: ['usersCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch service orders count
  const { data: ordersCount = 0 } = useQuery({
    queryKey: ['ordersCount'],
    queryFn: async () => {
      const { count } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch pending maintenance count
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

  // Fetch maintenance alerts
  const { data: alerts = [] } = useQuery({
    queryKey: ['maintenanceAlerts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('maintenance_schedules')
        .select(`
          *,
          machinery:machinery_id(name)
        `)
        .lte('next_maintenance_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('next_maintenance_date', { ascending: true })
        .limit(5);

      return (data || []).map(schedule => ({
        title: "Manutenção Preventiva Necessária",
        description: `${schedule.machinery?.name} requer manutenção em ${new Date(schedule.next_maintenance_date).toLocaleDateString()}`,
        severity: new Date(schedule.next_maintenance_date) <= new Date() ? "error" : "warning"
      }));
    },
  });

  // Fetch maintenance history for chart
  const { data: chartData = [] } = useQuery({
    queryKey: ['maintenanceHistory'],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 4);

      const { data: history } = await supabase
        .from('maintenance_history')
        .select('maintenance_date, maintenance_type')
        .gte('maintenance_date', startDate.toISOString())
        .order('maintenance_date', { ascending: true });

      const monthlyData = new Map();
      
      (history || []).forEach(record => {
        const month = new Date(record.maintenance_date).toLocaleString('default', { month: 'short' });
        if (!monthlyData.has(month)) {
          monthlyData.set(month, { month, preventive: 0, corrective: 0 });
        }
        const data = monthlyData.get(month);
        if (record.maintenance_type === 'preventive') {
          data.preventive++;
        } else if (record.maintenance_type === 'corrective') {
          data.corrective++;
        }
      });

      return Array.from(monthlyData.values());
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