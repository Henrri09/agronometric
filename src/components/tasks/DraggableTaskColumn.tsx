import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { DraggableTaskCard } from "./DraggableTaskCard";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  start_date?: string;
  service_orders: {
    id: string;
    title: string;
    description?: string;
    service_type: string;
    priority: string;
  } | null;
}

interface DraggableTaskColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  count: number;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

export function DraggableTaskColumn({
  id,
  title,
  tasks,
  count,
  onStatusChange,
  onDelete,
}: DraggableTaskColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef}>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <TaskColumn
          title={title}
          tasks={tasks}
          count={count}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          renderTask={(task) => (
            <DraggableTaskCard
              key={task.id}
              {...task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          )}
        />
      </SortableContext>
    </div>
  );
}