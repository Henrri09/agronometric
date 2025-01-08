import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./TaskCard";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  start_date?: string;
}

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  count: number;
  onStatusChange?: (id: string, newStatus: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskColumn({
  title,
  tasks,
  count,
  onStatusChange,
  onDelete,
}: TaskColumnProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-base font-medium">
          {title}
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs">
            {count} {count === 1 ? "tarefa" : "tarefas"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              priority={task.priority}
              status={task.status}
              date={task.start_date}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}