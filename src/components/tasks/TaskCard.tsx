import { MoreVertical, Calendar, ArrowUpDown } from "lucide-react";
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

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  date?: string;
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
  onStatusChange,
  onDelete,
}: TaskCardProps) {
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
        return <Badge variant="outline">todo</Badge>;
      case "preventive":
        return <Badge className="bg-blue-500">preventiva</Badge>;
      case "corrective":
        return <Badge variant="destructive">corretiva</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h4 className="font-medium">{title}</h4>
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
        <Badge className={getPriorityColor(priority)}>{priority}</Badge>
      </div>

      {date && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          {format(new Date(date), "dd 'de' MMMM", { locale: ptBR })}
        </div>
      )}
    </Card>
  );
}