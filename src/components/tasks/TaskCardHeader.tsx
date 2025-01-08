import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardHeaderProps {
  title: string;
  description?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TaskCardHeader({ title, description, isExpanded, onToggleExpand }: TaskCardHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <h4 className="font-medium">{title}</h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={onToggleExpand}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}