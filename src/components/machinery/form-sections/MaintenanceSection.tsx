import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { MachineryFormValues } from "../types";

interface MaintenanceSectionProps {
  form: UseFormReturn<MachineryFormValues>;
}

export function MaintenanceSection({ form }: MaintenanceSectionProps) {
  return (
    <FormField
      control={form.control}
      name="maintenance_frequency"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Frequência de Manutenção (dias)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="Digite a frequência em dias" 
              {...field}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}