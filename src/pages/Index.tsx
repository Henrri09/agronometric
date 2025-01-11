import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { MaintenanceChart } from "@/components/dashboard/MaintenanceChart";
import { MachineryStatusChart } from "@/components/dashboard/MachineryStatusChart";
import { CompanyIdProvider } from "@/components/dashboard/CompanyIdProvider";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Visão geral da manutenção de maquinários
        </p>
      </div>

      <CompanyIdProvider>
        <DashboardMetrics />

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <MaintenanceChart />
          <MachineryStatusChart />
        </div>
      </CompanyIdProvider>
    </div>
  );
};

export default Index;