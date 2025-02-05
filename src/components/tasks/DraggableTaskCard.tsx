
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
  } = useSortable({ 
    id: props.id,
    animateLayoutChanges: () => false // Desativa animações de layout para melhor performance
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 999 : 'auto',
    touchAction: 'none',
    cursor: isDragging ? 'grabbing' : 'grab',
    willChange: 'transform', // Otimiza a performance das transformações
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-manipulation select-none motion-reduce:transform-none"
    >
      <TaskCard {...props} />
    </div>
  );
}
