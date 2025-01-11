import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({ title, value, icon, isLoading = false }: DashboardCardProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold animate-in fade-in-50 duration-300">{value}</div>
      </CardContent>
    </Card>
  );
}