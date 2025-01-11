import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Wrench, ClipboardList, DollarSign } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6">
      <PageHeader
        title="Painel de Controle"
        description="Visualize os principais indicadores do seu negócio"
      />
      
      <MaintenanceAlert 
        title="Manutenção Preventiva"
        description="Há 3 equipamentos que precisam de manutenção preventiva esta semana."
        severity="warning"
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <DashboardCard
          title="Total de Usuários"
          value={150}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        
        <DashboardCard
          title="Maquinários"
          value={45}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
        />
        
        <DashboardCard
          title="Ordens de Serviço"
          value={28}
          icon={<ClipboardList className="h-4 w-4 text-muted-foreground" />}
        />
        
        <DashboardCard
          title="Economia Gerada"
          value={45000}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Manutenções Preventivas vs Corretivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de Manutenções
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status dos Equipamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Gráfico de Status
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}