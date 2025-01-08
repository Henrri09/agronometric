import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskCardHeaderProps {
  title: string;
  description?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TaskCardHeader({ title, description, isExpanded, onToggleExpand }: TaskCardHeaderProps) {
  return (
    <div className="space-y-1" onClick={onToggleExpand}>
      <div className="flex items-center gap-2">
        <h4 className="font-medium">{title}</h4>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}