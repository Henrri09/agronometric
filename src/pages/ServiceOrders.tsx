import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";
import { ServiceOrderCompletionForm } from "@/components/service-orders/ServiceOrderCompletionForm";

export default function ServiceOrders() {
  const [isCompleting, setIsCompleting] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleFormSubmitSuccess = () => {
    // Form will be reset automatically after submission
  };

  const handleCompletionSuccess = () => {
    setIsCompleting(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <PageHeader
        title="Ordens de Serviço"
        description={isCompleting 
          ? "Registre os custos e conclua a ordem de serviço"
          : "Crie novas ordens de serviço para o sistema"
        }
      />

      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-4 md:p-6">
          {isCompleting && selectedOrderId ? (
            <ServiceOrderCompletionForm
              serviceOrderId={selectedOrderId}
              onSuccess={handleCompletionSuccess}
              onCancel={() => {
                setIsCompleting(false);
                setSelectedOrderId(null);
              }}
            />
          ) : (
            <ServiceOrderForm onSuccess={handleFormSubmitSuccess} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}