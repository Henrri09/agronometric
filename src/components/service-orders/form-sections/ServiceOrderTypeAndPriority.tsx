import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ServiceOrderFormValues } from "../schema";

interface ServiceOrderTypeAndPriorityProps {
  control: Control<ServiceOrderFormValues>;
}

export function ServiceOrderTypeAndPriority({ control }: ServiceOrderTypeAndPriorityProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="service_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Serviço</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger >
                  <SelectValue placeholder="Selecione o tipo de serviço" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="preventive">Preventiva</SelectItem>
                <SelectItem value="corrective">Corretiva</SelectItem>
                <SelectItem value="installation">Instalação</SelectItem>
                <SelectItem value="calibration">Calibração</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Prioridade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="preventive">Preventiva</SelectItem>
                <SelectItem value="corrective">Corretiva</SelectItem>
                <SelectItem value="routine">Rotina</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}