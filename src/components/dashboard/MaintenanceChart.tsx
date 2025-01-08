import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function MaintenanceChart() {
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
  );
}