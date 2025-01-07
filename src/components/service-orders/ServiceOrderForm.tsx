import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const serviceOrderSchema = z.object({
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  service_type: z.enum(["preventive", "corrective", "installation", "calibration"]),
  priority: z.enum(["urgent", "preventive", "corrective", "routine"]),
  machinery_id: z.string().uuid("Selecione um equipamento"),
  location: z.string().min(3, "Localização deve ter no mínimo 3 caracteres"),
  branch: z.string().min(2, "Filial deve ter no mínimo 2 caracteres"),
  start_date: z.string(),
  end_date: z.string(),
});

type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>;

export function ServiceOrderForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const onSubmit = async (data: ServiceOrderFormValues) => {
    try {
      // Insert service order
      const { data: serviceOrder, error: serviceOrderError } = await supabase
        .from("service_orders")
        .insert({
          ...data,
          status: "pending",
        })
        .select()
        .single();

      if (serviceOrderError) throw serviceOrderError;

      // Create associated task
      const { error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: `OS: ${data.title}`,
          description: data.description,
          status: "todo",
          priority: data.priority,
          service_order_id: serviceOrder.id,
        });

      if (taskError) throw taskError;

      // Create calendar event
      const { error: calendarError } = await supabase
        .from("calendar_events")
        .insert({
          title: `OS: ${data.title}`,
          description: data.description,
          start_date: data.start_date,
          end_date: data.end_date,
          service_order_id: serviceOrder.id,
        });

      if (calendarError) throw calendarError;

      toast({
        title: "Ordem de serviço criada com sucesso!",
        description: "A ordem de serviço foi criada e as tarefas foram agendadas.",
      });

      navigate("/service-orders");
    } catch (error) {
      console.error("Error creating service order:", error);
      toast({
        title: "Erro ao criar ordem de serviço",
        description: "Ocorreu um erro ao criar a ordem de serviço. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="service_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Serviço</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="preventive">Preventiva</SelectItem>
                    <SelectItem value="corrective">Corretiva</SelectItem>
                    <SelectItem value="installation">Instalação</SelectItem>
                    <SelectItem value="calibration">Calibração</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="urgent">Urgente</SelectItem>
                    <SelectItem value="preventive">Preventiva</SelectItem>
                    <SelectItem value="corrective">Corretiva</SelectItem>
                    <SelectItem value="routine">Rotina</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="machinery_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Equipamento 1</SelectItem>
                  <SelectItem value="2">Equipamento 2</SelectItem>
                  <SelectItem value="3">Equipamento 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Filial</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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