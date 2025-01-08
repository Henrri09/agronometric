import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServiceOrdersListProps {
  serviceOrders: any[];
  getServiceTypeLabel: (type: string) => string;
  getPriorityLabel: (priority: string) => string;
}

export function ServiceOrdersList({ 
  serviceOrders, 
  getServiceTypeLabel, 
  getPriorityLabel 
}: ServiceOrdersListProps) {
  // Fetch users list
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data;
    },
  });

  // Function to get user name by ID
  const getUserName = (userId: string | null) => {
    if (!userId || !users) return '';
    const user = users.find(u => u.id === userId);
    return user?.full_name || '';
  };

  return (
    <div className="space-y-4">
      {serviceOrders.map((order) => (
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
                    {order.assigned_to && `Responsável: ${getUserName(order.assigned_to)}`}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {order.start_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-success" />
                  <span>
                    Início: {format(new Date(order.start_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
              )}
              
              {order.end_date && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-destructive" />
                  <span>
                    Término: {format(new Date(order.end_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Data de Entrega
                    </Badge>
                  </span>
                </div>
              )}
            </div>
          </div>

          {order.machinery && (
            <div className="mt-2 text-sm text-muted-foreground">
              <strong>Equipamento:</strong> {order.machinery.name}
              {order.machinery.model && ` - Modelo: ${order.machinery.model}`}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}