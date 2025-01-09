import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Wallet, LifeBuoy, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors" 
        onClick={() => navigate("/super-admin/financial")}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <Wallet className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-semibold">Gestão Financeira</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie dados financeiros e notas fiscais
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors" 
        onClick={() => navigate("/super-admin/analytics")}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <LineChart className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Análise de receita e métricas
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors" 
        onClick={() => navigate("/super-admin/support")}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <LifeBuoy className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-semibold">Suporte</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie tickets de suporte
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:bg-accent/50 transition-colors" 
        onClick={() => navigate("/super-admin/tutorials")}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
          <Video className="h-12 w-12 mb-2 text-primary" />
          <h3 className="text-lg font-semibold">Tutoriais</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie vídeos tutoriais
          </p>
        </CardContent>
      </Card>
    </div>
  );
}