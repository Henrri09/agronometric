import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";

export default function ServiceOrders() {
  const handleFormSubmitSuccess = () => {
    // Form will be reset automatically after submission
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Ordens de Serviço"
        description="Crie novas ordens de serviço para o sistema"
      />

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-4 md:p-6">
          <ServiceOrderForm onSuccess={handleFormSubmitSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}