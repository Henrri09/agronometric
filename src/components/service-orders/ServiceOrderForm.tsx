import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ServiceOrderFormValues, serviceOrderSchema } from "./schema";
import { useServiceOrderSubmit } from "./useServiceOrderSubmit";
import { ServiceOrderBasicInfo } from "./form-sections/ServiceOrderBasicInfo";
import { ServiceOrderTypeAndPriority } from "./form-sections/ServiceOrderTypeAndPriority";
import { ServiceOrderLocation } from "./form-sections/ServiceOrderLocation";
import { ServiceOrderDates } from "./form-sections/ServiceOrderDates";
import { DialogClose } from "@radix-ui/react-dialog";
import { Download } from "lucide-react";

interface ServiceOrderFormProps {
  initialData?: ServiceOrderFormValues;
  onSuccess?: () => void;
}

export function ServiceOrderForm({ initialData, onSuccess }: ServiceOrderFormProps) {
  const { onSubmit: handleSubmit } = useServiceOrderSubmit(initialData?.id);
  
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
      start_time: "",
      end_date: "",
      end_time: "",
      requester: "",
      assigned_to: "",
      problem_photos: [],
      machinery_photos: [],
    },
  });

  const onSubmit = async (data: ServiceOrderFormValues) => {
    await handleSubmit(data);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ServiceOrderBasicInfo control={form.control} />
        <ServiceOrderLocation control={form.control} />
        <ServiceOrderDates control={form.control} />
        <ServiceOrderTypeAndPriority control={form.control} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Baixar PDF
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"} Ordem de Serviço
          </Button>
        </div>
      </form>
    </Form>
  );
}