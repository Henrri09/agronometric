import * as z from "zod";

export const serviceOrderCompletionSchema = z.object({
  labor_cost: z.number().min(0, "O custo não pode ser negativo"),
  downtime_hours: z.number().min(0, "As horas não podem ser negativas"),
  downtime_cost_per_hour: z.number().min(0, "O custo por hora não pode ser negativo"),
  indirect_costs: z.number().min(0, "Os custos indiretos não podem ser negativos"),
  description: z.string().optional(),
});

export type ServiceOrderCompletionValues = z.infer<typeof serviceOrderCompletionSchema>;