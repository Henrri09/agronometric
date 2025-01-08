import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardAlerts } from "@/components/dashboard/DashboardAlerts";
import { MaintenanceChart } from "@/components/dashboard/MaintenanceChart";

const Index = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardAlerts />
      <DashboardStats />
      <MaintenanceChart />
    </div>
  );
};

export default Index;