import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";

export function DashboardAlerts() {
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
        severity: (new Date(schedule.next_maintenance_date) <= new Date() ? "error" : "warning") as const
      }));
    },
  });

  return (
    <div className="space-y-4">
      {alerts.map((alert, index) => (
        <MaintenanceAlert key={index} {...alert} />
      ))}
    </div>
  );
}