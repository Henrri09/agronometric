import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const maintenanceData = [
  { month: "Jan", preventive: 12, corrective: 5 },
  { month: "Fev", preventive: 15, corrective: 4 },
  { month: "Mar", preventive: 18, corrective: 3 },
  { month: "Abr", preventive: 16, corrective: 6 },
  { month: "Mai", preventive: 20, corrective: 2 },
  { month: "Jun", preventive: 22, corrective: 1 },
];

const costData = [
  { equipment: "Tombador", cost: 12000, savings: 5000 },
  { equipment: "Esteira Principal", cost: 8000, savings: 3000 },
  { equipment: "Estrusora", cost: 15000, savings: 7000 },
];

export default function Analytics() {
  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        description="Análise detalhada de desempenho e métricas dos equipamentos"
      />

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Manutenções Preventivas vs Corretivas</h3>
          <div className="h-[400px]">
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
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Custos e Economia por Equipamento</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="equipment" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cost" name="Custo Total" fill="#FF4444" />
                <Bar dataKey="savings" name="Economia" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}