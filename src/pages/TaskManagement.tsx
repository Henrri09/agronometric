import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";
import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskBoard } from "@/components/tasks/TaskBoard";

export default function TaskManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  // Configure DnD sensors with improved sensitivity
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Reduzido para 5px para iniciar o drag mais facilmente
      delay: 0, // Sem delay para resposta imediata
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100, // Reduzido para 100ms para resposta mais rápida
      tolerance: 8, // Aumentado levemente para melhor detecção em touch
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*, service_orders(*)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleNewTaskSuccess = () => {
    setIsNewTaskDialogOpen(false);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Tarefas"
        description="Arraste e solte os cards para organizar as tarefas"
      />

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Filtrar por data
          </Button>
          <Button className="gap-2" onClick={() => setIsNewTaskDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <TaskBoard tasks={filteredTasks} sensors={sensors} />

      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nova Tarefa</DialogTitle>
          </DialogHeader>
          <ServiceOrderForm onSuccess={handleNewTaskSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}