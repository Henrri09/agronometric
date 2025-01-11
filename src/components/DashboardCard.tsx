import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface DashboardCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ReactNode;
  isLoading?: boolean;
  isCurrency?: boolean;
  isClickable?: boolean;
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  isLoading = false,
  isCurrency = false,
  isClickable = false 
}: DashboardCardProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
          {subtitle && <Skeleton className="h-4 w-32 mt-1" />}
        </CardContent>
      </Card>
    );
  }

  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value))
    : value;

  return (
    <Card className={`transition-all duration-300 ${isClickable ? 'hover:shadow-md cursor-pointer' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold animate-in fade-in-50 duration-300">
          {formattedValue}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}