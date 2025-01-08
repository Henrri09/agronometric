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

const mockData = {
  alerts: [
    {
      title: "Manutenção Preventiva Necessária",
      description: "Esteira transportadora B2 requer manutenção em 3 dias",
      severity: "warning" as const,
    },
    {
      title: "Manutenção Urgente",
      description: "Moinho M5 apresentando vibração anormal",
      severity: "error" as const,
    },
  ],
  stats: {
    machines: 24,
    users: 15,
    orders: 8,
    maintenance: 3,
  },
  chartData: [
    { month: "Jan", preventive: 12, corrective: 5 },
    { month: "Fev", preventive: 15, corrective: 4 },
    { month: "Mar", preventive: 18, corrective: 3 },
    { month: "Abr", preventive: 16, corrective: 6 },
  ],
};

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="space-y-4">
        {mockData.alerts.map((alert, index) => (
          <MaintenanceAlert key={index} {...alert} />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Maquinários"
          value={mockData.stats.machines}
          icon={<Tractor className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Usuários"
          value={mockData.stats.users}
          icon={<Users className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Ordens de Serviço"
          value={mockData.stats.orders}
          icon={<ClipboardList className="h-4 w-4 text-primary" />}
        />
        <DashboardCard
          title="Manutenções Pendentes"
          value={mockData.stats.maintenance}
          icon={<Wrench className="h-4 w-4 text-primary" />}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Manutenções Preventivas vs. Corretivas</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.chartData}>
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