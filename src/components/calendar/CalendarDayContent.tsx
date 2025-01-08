import React from "react";
import { Badge } from "@/components/ui/badge";

interface CalendarDayContentProps {
  day: Date;
  serviceOrders: any[];
}

export function CalendarDayContent({ day, serviceOrders }: CalendarDayContentProps) {
  const isStartDate = serviceOrders.some(
    order => order.start_date && new Date(order.start_date).toDateString() === day.toDateString()
  );

  const isEndDate = serviceOrders.some(
    order => order.end_date && new Date(order.end_date).toDateString() === day.toDateString()
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <span>{day.getDate()}</span>
      <div className="absolute -top-1 right-0 flex gap-0.5">
        {isStartDate && (
          <Badge variant="default" className="h-2 w-2 p-0 bg-success" />
        )}
        {isEndDate && (
          <Badge variant="default" className="h-2 w-2 p-0 bg-destructive" />
        )}
      </div>
    </div>
  );
}