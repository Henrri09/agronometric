import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { DraggableTaskColumn } from "@/components/tasks/DraggableTaskColumn";

export default function TaskManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Configure DnD sensors for both mouse and touch
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px of movement required before activation
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms delay before activation
      tolerance: 5, // 5px of movement allowed before activation
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

  const updateTaskStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Status atualizado",
        description: "O status da tarefa foi atualizado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status da tarefa.",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Tarefa excluída",
        description: "A tarefa foi excluída com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir tarefa",
        description: "Ocorreu um erro ao excluir a tarefa.",
      });
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateTaskStatus.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    deleteTask.mutate(id);
  };

  const handleNewTaskSuccess = () => {
    setIsNewTaskDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast({
      title: "Tarefa criada",
      description: "A nova tarefa foi criada com sucesso.",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as string;
      handleStatusChange(taskId, newStatus);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: string) =>
    filteredTasks.filter((task) => task.status === status);

  const todoTasks = getTasksByStatus("todo");
  const inProgressTasks = getTasksByStatus("in_progress");
  const reviewTasks = getTasksByStatus("review");
  const doneTasks = getTasksByStatus("done");

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

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <DraggableTaskColumn
            id="todo"
            title="A Fazer"
            tasks={todoTasks}
            count={todoTasks.length}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
          <DraggableTaskColumn
            id="in_progress"
            title="Em Andamento"
            tasks={inProgressTasks}
            count={inProgressTasks.length}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
          <DraggableTaskColumn
            id="review"
            title="Revisão"
            tasks={reviewTasks}
            count={reviewTasks.length}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
          <DraggableTaskColumn
            id="done"
            title="Concluído"
            tasks={doneTasks}
            count={doneTasks.length}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      </DndContext>

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