import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrderFormValues } from "./schema";

export const useServiceOrderSubmit = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: ServiceOrderFormValues) => {
    try {
      // Insert service order
      const { data: serviceOrder, error: serviceOrderError } = await supabase
        .from("service_orders")
        .insert({
          title: data.title,
          description: data.description,
          service_type: data.service_type,
          priority: data.priority,
          machinery_id: data.machinery_id,
          location: data.location,
          branch: data.branch,
          start_date: data.start_date,
          end_date: data.end_date,
          status: 'pending'
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

  return { onSubmit };
};