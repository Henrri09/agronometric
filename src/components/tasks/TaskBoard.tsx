import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { DraggableTaskColumn } from "./DraggableTaskColumn";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  service_orders: {
    id: string;
    title: string;
    description?: string;
    service_type: string;
    priority: string;
  } | null;
}

interface TaskBoardProps {
  tasks: Task[];
  sensors: any;
}

export function TaskBoard({ tasks, sensors }: TaskBoardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateTaskStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Error updating task status:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao atualizar o status da tarefa.",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast({
      title: "Status atualizado",
      description: "O status da tarefa foi atualizado com sucesso.",
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir tarefa",
        description: "Ocorreu um erro ao excluir a tarefa.",
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi excluída com sucesso.",
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as string;
      updateTaskStatus(taskId, newStatus);
    }
  };

  const getTasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  const todoTasks = getTasksByStatus("todo");
  const inProgressTasks = getTasksByStatus("in_progress");
  const reviewTasks = getTasksByStatus("review");
  const doneTasks = getTasksByStatus("done");

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <DraggableTaskColumn
          id="todo"
          title="A Fazer"
          tasks={todoTasks}
          count={todoTasks.length}
          onStatusChange={updateTaskStatus}
          onDelete={handleDelete}
        />
        <DraggableTaskColumn
          id="in_progress"
          title="Em Andamento"
          tasks={inProgressTasks}
          count={inProgressTasks.length}
          onStatusChange={updateTaskStatus}
          onDelete={handleDelete}
        />
        <DraggableTaskColumn
          id="review"
          title="Revisão"
          tasks={reviewTasks}
          count={reviewTasks.length}
          onStatusChange={updateTaskStatus}
          onDelete={handleDelete}
        />
        <DraggableTaskColumn
          id="done"
          title="Concluído"
          tasks={doneTasks}
          count={doneTasks.length}
          onStatusChange={updateTaskStatus}
          onDelete={handleDelete}
        />
      </div>
    </DndContext>
  );
}