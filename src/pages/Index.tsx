import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { CompanyIdProvider } from "@/components/dashboard/CompanyIdProvider";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { MaintenanceChart } from "@/components/dashboard/MaintenanceChart";
import { MachineryStatusChart } from "@/components/dashboard/MachineryStatusChart";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Visualize os principais indicadores do seu negócio
        </p>
      </div>

      <CompanyIdProvider>
        <div className="space-y-4">
          <MaintenanceAlert 
            title="Manutenção Preventiva"
            description="Há equipamentos que precisam de manutenção preventiva esta semana."
            severity="warning"
          />
          
          <DashboardMetrics />
          
          <div className="grid gap-4 mt-4 md:grid-cols-2">
            <MaintenanceChart />
            <MachineryStatusChart />
          </div>
        </div>
      </CompanyIdProvider>
    </div>
  );
};

export default Index;