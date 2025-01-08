import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, User, Clock } from "lucide-react";

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