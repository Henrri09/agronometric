import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ServiceOrderFormValues, serviceOrderSchema } from "./schema";
import { useServiceOrderSubmit } from "./useServiceOrderSubmit";
import { ServiceOrderBasicInfo } from "./form-sections/ServiceOrderBasicInfo";
import { ServiceOrderTypeAndPriority } from "./form-sections/ServiceOrderTypeAndPriority";
import { ServiceOrderLocation } from "./form-sections/ServiceOrderLocation";
import { ServiceOrderDates } from "./form-sections/ServiceOrderDates";

interface ServiceOrderFormProps {
  initialData?: ServiceOrderFormValues;
}

export function ServiceOrderForm({ initialData }: ServiceOrderFormProps) {
  const navigate = useNavigate();
  const { onSubmit } = useServiceOrderSubmit(initialData?.id);
  
  const form = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      service_type: "preventive",
      priority: "routine",
      location: "",
      branch: "",
      start_date: "",
      end_date: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ServiceOrderBasicInfo control={form.control} />
        <ServiceOrderTypeAndPriority control={form.control} />
        <ServiceOrderLocation control={form.control} />
        <ServiceOrderDates control={form.control} />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/service-orders")}
          >
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"} Ordem de Serviço
          </Button>
        </div>
      </form>
    </Form>
  );
}