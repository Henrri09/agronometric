import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { ptBR } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, isSameDay } from "date-fns";
import { MapPin, User, Clock } from "lucide-react";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: serviceOrders, isLoading } = useQuery({
    queryKey: ["service-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_orders")
        .select(`
          *,
          machinery:machinery_id (
            name,
            model
          )
        `)
        .not("start_date", "is", null);

      if (error) throw error;
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
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  // Filtra eventos para a data selecionada
  const selectedDateEvents = serviceOrders?.filter(
    order => date && order.start_date && isSameDay(new Date(order.start_date), date)
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
              modifiers={{
                booked: (date) => {
                  return serviceOrders?.some(
                    order => order.start_date && isSameDay(new Date(order.start_date), date)
                  ) || false;
                },
              }}
              modifiersStyles={{
                booked: {
                  fontWeight: "bold",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "4px",
                },
              }}
            />
          </CardContent>
        </Card>

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
              <div className="space-y-4">
                {selectedDateEvents.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col space-y-3 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{order.title}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {getServiceTypeLabel(order.service_type || '')}
                        </Badge>
                        <Badge variant="outline">
                          {getPriorityLabel(order.priority || '')}
                        </Badge>
                      </div>
                    </div>

                    {order.description && (
                      <p className="text-sm text-muted-foreground">{order.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        {(order.location || order.branch) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {order.location}
                              {order.branch && ` - ${order.branch}`}
                            </span>
                          </div>
                        )}

                        {(order.requester || order.assigned_to) && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>
                              {order.requester && `Solicitante: ${order.requester}`}
                              {order.assigned_to && order.requester && " | "}
                              {order.assigned_to && `Responsável: ${order.assigned_to}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {order.start_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Início: {format(new Date(order.start_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        )}
                        
                        {order.end_date && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              Término: {format(new Date(order.end_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nenhuma ordem de serviço programada para esta data.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}