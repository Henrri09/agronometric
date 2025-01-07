import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";

export default function ServiceOrderRegister() {
  return (
    <div className="p-6">
      <PageHeader
        title="Registrar Ordem de Serviço"
        description="Crie uma nova ordem de serviço no sistema"
      />
      
      <Card>
        <CardContent className="p-6">
          <ServiceOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}