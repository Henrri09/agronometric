import { MapPin, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ServiceOrder {
  title: string;
  description?: string;
  service_type: string;
  priority: string;
  location?: string;
  branch?: string;
  requester?: string;
  assigned_to?: string;
  start_date?: string;
  end_date?: string;
}

interface ServiceOrderDetailsProps {
  serviceOrder: ServiceOrder;
}

export function ServiceOrderDetails({ serviceOrder }: ServiceOrderDetailsProps) {
  const getServiceTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
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
    switch (priority.toLowerCase()) {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return format(new Date(dateString), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="mt-4 space-y-3 border-t pt-4">
      <h5 className="text-sm font-medium">Ordem de Serviço Relacionada</h5>
      <div className="rounded-md border p-4 text-sm space-y-3">
        <div className="font-medium">{serviceOrder.title}</div>
        {serviceOrder.description && (
          <p className="text-muted-foreground">{serviceOrder.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getServiceTypeLabel(serviceOrder.service_type)}
              </Badge>
              <Badge variant="outline">
                {getPriorityLabel(serviceOrder.priority)}
              </Badge>
            </div>

            {(serviceOrder.location || serviceOrder.branch) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {serviceOrder.location}
                  {serviceOrder.branch && ` - ${serviceOrder.branch}`}
                </span>
              </div>
            )}

            {(serviceOrder.requester || serviceOrder.assigned_to) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {serviceOrder.requester && `Solicitante: ${serviceOrder.requester}`}
                  {serviceOrder.assigned_to && serviceOrder.requester && " | "}
                  {serviceOrder.assigned_to && `Responsável: ${serviceOrder.assigned_to}`}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {serviceOrder.start_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Início: {formatDate(serviceOrder.start_date)}
                </span>
              </div>
            )}
            
            {serviceOrder.end_date && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  Término: {formatDate(serviceOrder.end_date)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}