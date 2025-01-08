import { z } from "zod";

export const machineryFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  model: z.string().min(2, "Modelo deve ter no mínimo 2 caracteres"),
  serial_number: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive"]),
  maintenance_frequency: z.number().min(0, "Frequência deve ser maior ou igual a 0"),
});

export type MachineryFormValues = z.infer<typeof machineryFormSchema>;