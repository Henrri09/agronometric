
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "./TaskCard";

interface DraggableTaskCardProps {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  date?: string;
  serviceOrders?: {
    id: string;
    title: string;
    description?: string;
    service_type: string;
    priority: string;
  } | null;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

export function DraggableTaskCard(props: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto',
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation select-none transform will-change-transform motion-reduce:transform-none transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[1.01] hover:shadow-lg"
    >
      <TaskCard {...props} />
    </div>
  );
}
