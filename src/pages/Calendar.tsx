import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isSameDay } from "date-fns";
import { CalendarDayContent } from "@/components/calendar/CalendarDayContent";
import { ServiceOrdersList } from "@/components/calendar/ServiceOrdersList";
import { MaintenanceAlert } from "@/components/MaintenanceAlert";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: serviceOrders, isLoading } = useQuery({
    queryKey: ["service-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          machinery (
            name,
            model
          )
        `)
        .not("start_date", "is", null);

      if (error) {
        console.error("Error fetching service orders:", error);
        throw error;
      }

      console.log("Fetched service orders:", data);
      return data;
    },
  });

  const getServiceTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "preventive":
        return "Preventiva";
      case "corrective":
        return "Corretiva";
      case "installation":
        return "Instalação";
      case "calibration":
        return "Calibração";
      default:
        return type;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "urgent":
        return "Urgente";
      case "preventive":
        return "Preventiva";
      case "corrective":
        return "Corretiva";
      case "routine":
        return "Rotina";
      default:
        return priority;
    }
  };

  // Filtra eventos para a data selecionada
  const selectedDateEvents = serviceOrders?.filter(
    order => date && order.start_date && isSameDay(new Date(order.start_date), date)
  ) || [];

  // Verifica se há entregas pendentes na data selecionada
  const dueDateEvents = serviceOrders?.filter(
    order => date && order.end_date && isSameDay(new Date(order.end_date), date)
  ) || [];

  return (
    <div className="p-6">
      <PageHeader
        title="Calendário"
        description="Gerencie eventos e manutenções programadas"
      />

      <div className="grid gap-6 md:grid-cols-[400px,1fr] mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
              components={{
                DayContent: ({ date: dayDate }) => (
                  <CalendarDayContent 
                    day={dayDate} 
                    serviceOrders={serviceOrders || []} 
                  />
                ),
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          {dueDateEvents.length > 0 && (
            <MaintenanceAlert
              title="Entregas Pendentes"
              description={`Existem ${dueDateEvents.length} ordem(s) de serviço com entrega prevista para hoje.`}
              severity="warning"
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>
                Ordens de Serviço do Dia {date?.toLocaleDateString('pt-BR')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Carregando...</p>
              ) : selectedDateEvents.length > 0 ? (
                <ServiceOrdersList
                  serviceOrders={selectedDateEvents}
                  getServiceTypeLabel={getServiceTypeLabel}
                  getPriorityLabel={getPriorityLabel}
                />
              ) : (
                <p className="text-muted-foreground">
                  Nenhuma ordem de serviço programada para esta data.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}