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
  const [stats, setStats] = useState({
    machines: 0,
    users: 0,
    orders: 0,
    maintenance: 0,
  });

  const [maintenanceData, setMaintenanceData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch machinery count
  const { data: machineryCount } = useQuery({
    queryKey: ['machinery-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('machinery')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch users count
  const { data: usersCount } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch service orders count
  const { data: ordersCount } = useQuery({
    queryKey: ['orders-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('service_orders')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch pending maintenance count
  const { data: maintenanceCount } = useQuery({
    queryKey: ['maintenance-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('maintenance_schedules')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      return count || 0;
    },
  });

  // Fetch maintenance history for chart
  const { data: maintenanceHistory } = useQuery({
    queryKey: ['maintenance-history'],
    queryFn: async () => {
      const { data } = await supabase
        .from('maintenance_history')
        .select('maintenance_date, maintenance_type')
        .order('maintenance_date', { ascending: true })
        .limit(50);
      
      // Process data for chart
      const processedData = data?.reduce((acc: any, curr: any) => {
        const month = new Date(curr.maintenance_date).toLocaleString('default', { month: 'short' });
        const type = curr.maintenance_type === 'preventive' ? 'preventive' : 'corrective';
        
        const existingMonth = acc.find((item: any) => item.month === month);
        if (existingMonth) {
          existingMonth[type] = (existingMonth[type] || 0) + 1;
        } else {
          acc.push({
            month,
            preventive: type === 'preventive' ? 1 : 0,
            corrective: type === 'corrective' ? 1 : 0,
          });
        }
        return acc;
      }, []);

      return processedData || [];
    },
  });

  // Fetch maintenance alerts
  const { data: maintenanceAlerts } = useQuery({
    queryKey: ['maintenance-alerts'],
    queryFn: async () => {
      const { data: schedules } = await supabase
        .from('maintenance_schedules')
        .select(`
          id,
          next_maintenance_date,
          machinery_id,
          machinery (
            name
          )
        `)
        .lt('next_maintenance_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('next_maintenance_date', { ascending: true })
        .limit(5);

      return schedules?.map((schedule: any) => ({
        title: "Manutenção Preventiva Necessária",
        description: `${schedule.machinery?.name} requer manutenção em ${
          Math.ceil((new Date(schedule.next_maintenance_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        } dias`,
        severity: "warning" as const,
      })) || [];
    },
  });

  useEffect(() => {
    if (machineryCount !== undefined) {
      setStats(prev => ({ ...prev, machines: machineryCount }));
    }
    if (usersCount !== undefined) {
      setStats(prev => ({ ...prev, users: usersCount }));
    }
    if (ordersCount !== undefined) {
      setStats(prev => ({ ...prev, orders: ordersCount }));
    }
    if (maintenanceCount !== undefined) {
      setStats(prev => ({ ...prev, maintenance: maintenanceCount }));
    }
    if (maintenanceHistory) {
      setMaintenanceData(maintenanceHistory);
    }
    if (maintenanceAlerts) {
      setAlerts(maintenanceAlerts);
    }
  }, [machineryCount, usersCount, ordersCount, maintenanceCount, maintenanceHistory, maintenanceAlerts]);

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
          value={stats.machines}
          icon={<Tractor className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Usuários"
          value={stats.users}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Ordens de Serviço"
          value={stats.orders}
          icon={<ClipboardList className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Manutenções Pendentes"
          value={stats.maintenance}
          icon={<Wrench className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manutenções Preventivas vs. Corretivas</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceData}>
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