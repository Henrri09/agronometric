import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrderFormValues } from "@/components/service-orders/schema";

export default function ServiceOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: serviceOrder, isLoading } = useQuery({
    queryKey: ['serviceOrder', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ServiceOrderFormValues;
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!serviceOrder) {
    return <div>Ordem de serviço não encontrada</div>;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Editar Ordem de Serviço"
        description="Atualize os dados da ordem de serviço"
      />
      
      <Card>
        <CardContent className="p-6">
          <ServiceOrderForm initialData={serviceOrder} />
        </CardContent>
      </Card>
    </div>
  );
}