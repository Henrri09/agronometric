
import { MoreVertical, Calendar, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { TaskCardHeader } from "./TaskCardHeader";
import { ServiceOrderDetails } from "./ServiceOrderDetails";

interface ServiceOrder {
  id: string;
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

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  date?: string;
  serviceOrders?: ServiceOrder | null;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({
  id,
  title,
  description,
  priority,
  status,
  date,
  serviceOrders,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getServiceTypeClass = (type: string) => {
    switch (type?.toLowerCase()) {
      case "preventive":
        return "bg-blue-100 text-blue-700";
      case "corrective":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return <Badge variant="outline" className="bg-white">A fazer</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/20 text-primary border-none">Em andamento</Badge>;
      case "review":
        return <Badge className="bg-warning/20 text-warning border-none">Em revisão</Badge>;
      case "done":
        return <Badge className="bg-success/20 text-success border-none">Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-base">{title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => onStatusChange?.(id, "todo")}>
                Mover para A Fazer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(id, "in_progress")}>
                Mover para Em Andamento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(id, "review")}>
                Mover para Revisão
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange?.(id, "done")}>
                Mover para Concluído
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(id)}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}

        <div className="flex items-center gap-2">
          {getStatusBadge(status)}
          {serviceOrders && (
            <Badge 
              className={`${getServiceTypeClass(serviceOrders.service_type)} border-none`}
            >
              {serviceOrders.service_type === "preventive" ? "preventiva" : serviceOrders.service_type}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          {date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:bg-transparent hover:text-primary p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Ver menos" : "Ver mais"}
          </Button>
        </div>

        {isExpanded && serviceOrders && (
          <ServiceOrderDetails serviceOrder={serviceOrders} />
        )}
      </div>
    </Card>
  );
}
