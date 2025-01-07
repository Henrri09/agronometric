import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface MaintenanceAlertProps {
  title: string;
  description: string;
  severity: "warning" | "error" | "success";
}

export function MaintenanceAlert({ title, description, severity }: MaintenanceAlertProps) {
  const severityStyles = {
    warning: "bg-warning/20 text-warning border-warning",
    error: "bg-destructive/20 text-destructive border-destructive",
    success: "bg-success/20 text-success border-success",
  };

  return (
    <Alert className={severityStyles[severity]}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}