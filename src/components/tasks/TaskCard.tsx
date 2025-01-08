import { MoreVertical, Calendar, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
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

interface ServiceOrder {
  id: string;
  title: string;
  description?: string;
  service_type: string;
  priority: string;
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500 hover:bg-red-600";
      case "high":
        return "bg-orange-500 hover:bg-orange-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return <Badge variant="outline">A fazer</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">Em andamento</Badge>;
      case "review":
        return <Badge className="bg-yellow-500">Em revisão</Badge>;
      case "done":
        return <Badge className="bg-green-500">Concluído</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

  const getServiceTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "preventive":
        return "Preventiva";
      case "corrective":
        return "Corretiva";
      default:
        return type;
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{title}</h4>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

      <div className="flex items-center gap-2">
        {getStatusBadge(status)}
        <Badge className={getPriorityColor(priority)}>
          {getPriorityLabel(priority)}
        </Badge>
      </div>

      {date && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
        </div>
      )}

      {isExpanded && serviceOrders && (
        <div className="mt-4 space-y-2 border-t pt-4">
          <h5 className="text-sm font-medium">Ordem de Serviço Relacionada</h5>
          <div className="rounded-md border p-3 text-sm space-y-2">
            <div className="font-medium">{serviceOrders.title}</div>
            {serviceOrders.description && (
              <p className="text-muted-foreground">{serviceOrders.description}</p>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {getServiceTypeLabel(serviceOrders.service_type)}
              </Badge>
              <Badge variant="outline">
                {getPriorityLabel(serviceOrders.priority)}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}