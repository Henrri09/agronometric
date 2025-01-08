import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ServiceOrderCompletionValues, serviceOrderCompletionSchema } from "./completion-schema";
import { useState } from "react";

interface ServiceOrderCompletionFormProps {
  serviceOrderId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServiceOrderCompletionForm({ serviceOrderId, onSuccess, onCancel }: ServiceOrderCompletionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceOrderCompletionValues>({
    resolver: zodResolver(serviceOrderCompletionSchema),
    defaultValues: {
      labor_cost: 0,
      downtime_hours: 0,
      downtime_cost_per_hour: 0,
      indirect_costs: 0,
      description: "",
    },
  });

  const onSubmit = async (data: ServiceOrderCompletionValues) => {
    try {
      setIsSubmitting(true);

      // Calculate total cost
      const totalCost = data.labor_cost + 
        (data.downtime_hours * data.downtime_cost_per_hour) + 
        data.indirect_costs;

      // Create maintenance history record
      const { error: maintenanceError } = await supabase
        .from("maintenance_history")
        .insert({
          service_order_id: serviceOrderId,
          maintenance_date: new Date().toISOString(),
          maintenance_type: "corrective", // You might want to make this dynamic
          description: data.description,
          labor_cost: data.labor_cost,
          downtime_hours: data.downtime_hours,
          downtime_cost_per_hour: data.downtime_cost_per_hour,
          indirect_costs: data.indirect_costs,
          total_cost: totalCost,
        });

      if (maintenanceError) throw maintenanceError;

      // Update service order status
      const { error: updateError } = await supabase
        .from("service_orders")
        .update({ status: "completed" })
        .eq("id", serviceOrderId);

      if (updateError) throw updateError;

      toast({
        title: "Ordem de serviço concluída com sucesso!",
        description: "Os custos de manutenção foram registrados.",
      });

      onSuccess?.();
    } catch (error) {
      console.error("Error completing service order:", error);
      toast({
        title: "Erro ao concluir ordem de serviço",
        description: "Ocorreu um erro ao registrar os custos de manutenção.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="labor_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo da mão de obra (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="downtime_hours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horas de inatividade</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="downtime_cost_per_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custo por hora de inatividade (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="indirect_costs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Custos indiretos (R$)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
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
              <FormLabel>Descrição do serviço realizado</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Concluindo..." : "Concluir ordem de serviço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}