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

export function ServiceOrderForm() {
  const navigate = useNavigate();
  const { onSubmit } = useServiceOrderSubmit();
  
  const form = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: {
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
          <Button type="submit">Criar Ordem de Serviço</Button>
        </div>
      </form>
    </Form>
  );
}