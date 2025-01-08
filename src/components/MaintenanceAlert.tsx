import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MaintenanceAlertProps {
  title: string;
  description: string;
  severity: "warning" | "error";
}

export function MaintenanceAlert({ title, description, severity }: MaintenanceAlertProps) {
  return (
    <Alert variant={severity === "error" ? "destructive" : "default"}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}