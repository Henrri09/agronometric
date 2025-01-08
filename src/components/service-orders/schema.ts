import * as z from "zod";

export const serviceOrderSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Título deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  service_type: z.enum(["preventive", "corrective", "installation", "calibration"]),
  priority: z.enum(["urgent", "preventive", "corrective", "routine"]),
  machinery_id: z.string().uuid("Selecione um equipamento"),
  location: z.string().min(3, "Localização deve ter no mínimo 3 caracteres"),
  branch: z.string().min(2, "Filial deve ter no mínimo 2 caracteres"),
  start_date: z.string(),
  start_time: z.string(),
  end_date: z.string(),
  end_time: z.string(),
  requester: z.string().min(2, "Nome do solicitante deve ter no mínimo 2 caracteres"),
  assigned_to: z.string().min(2, "Nome do responsável deve ter no mínimo 2 caracteres"),
  problem_photos: z.array(z.string()).optional(),
  machinery_photos: z.array(z.string()).optional(),
});

export type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>;