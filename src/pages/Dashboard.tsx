import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";
import { DashboardCard } from "@/components/DashboardCard";

export default function Dashboard() {
  return (
    <div className="p-6">
      <PageHeader
        title="Painel de Controle"
        description="Visualize os principais indicadores do seu negócio"
      />
      
      <MaintenanceAlert />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Usuários"
          value="150"
          description="Usuários ativos no sistema"
          trend="up"
          trendValue="12%"
        />
        
        <DashboardCard
          title="Maquinários"
          value="45"
          description="Equipamentos cadastrados"
          trend="up"
          trendValue="5%"
        />
        
        <DashboardCard
          title="Ordens de Serviço"
          value="28"
          description="Ordens em aberto"
          trend="down"
          trendValue="3%"
        />
        
        <DashboardCard
          title="Economia Gerada"
          value="R$ 45.000"
          description="Últimos 30 dias"
          trend="up"
          trendValue="18%"
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