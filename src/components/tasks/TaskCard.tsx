
import { MoreVertical, Calendar } from "lucide-react";
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

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500/80";
      case "high":
        return "bg-orange-500/80";
      case "medium":
        return "bg-yellow-500/80";
      case "low":
        return "bg-blue-500/80";
      default:
        return "bg-blue-500/80";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "todo":
        return <Badge variant="outline">A fazer</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/80">Em andamento</Badge>;
      case "review":
        return <Badge className="bg-warning/80">Em revisão</Badge>;
      case "done":
        return <Badge className="bg-success/80">Concluído</Badge>;
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

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <TaskCardHeader
            title={title}
            description={description}
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
          />
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
          <ServiceOrderDetails serviceOrder={serviceOrders} />
        )}
      </div>
    </Card>
  );
}
