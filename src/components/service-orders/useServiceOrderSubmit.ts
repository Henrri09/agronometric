import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrderFormValues } from "./schema";
import { useQueryClient } from "@tanstack/react-query";

export const useServiceOrderSubmit = (serviceOrderId?: string) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onSubmit = async (data: ServiceOrderFormValues) => {
    try {
      if (serviceOrderId) {
        // Update existing service order
        const { error: serviceOrderError } = await supabase
          .from("service_orders")
          .update({
            title: data.title,
            description: data.description,
            service_type: data.service_type,
            priority: data.priority,
            machinery_id: data.machinery_id,
            location: data.location,
            branch: data.branch,
            start_date: data.start_date,
            start_time: data.start_time,
            end_date: data.end_date,
            end_time: data.end_time,
            requester: data.requester,
            assigned_to: data.assigned_to,
            problem_photos: data.problem_photos,
            machinery_photos: data.machinery_photos,
          })
          .eq('id', serviceOrderId);

        if (serviceOrderError) throw serviceOrderError;

        // Update associated task
        const { error: taskError } = await supabase
          .from("tasks")
          .update({
            title: `OS: ${data.title}`,
            description: data.description,
            priority: data.priority,
          })
          .eq('service_order_id', serviceOrderId);

        if (taskError) throw taskError;

        // Update calendar event
        const { error: calendarError } = await supabase
          .from("calendar_events")
          .update({
            title: `OS: ${data.title}`,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date,
          })
          .eq('service_order_id', serviceOrderId);

        if (calendarError) throw calendarError;

        toast({
          title: "Ordem de serviço atualizada com sucesso!",
          description: "A ordem de serviço foi atualizada e as tarefas foram reagendadas.",
        });
      } else {
        // Insert new service order
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
            start_time: data.start_time,
            end_date: data.end_date,
            end_time: data.end_time,
            requester: data.requester,
            assigned_to: data.assigned_to,
            problem_photos: data.problem_photos,
            machinery_photos: data.machinery_photos,
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
      }

      // Invalidate queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      navigate("/service-orders");
    } catch (error) {
      console.error("Error saving service order:", error);
      toast({
        title: `Erro ao ${serviceOrderId ? 'atualizar' : 'criar'} ordem de serviço`,
        description: `Ocorreu um erro ao ${serviceOrderId ? 'atualizar' : 'criar'} a ordem de serviço. Tente novamente.`,
        variant: "destructive",
      });
    }
  };

  return { onSubmit };
};