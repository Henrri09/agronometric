import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ServiceOrderFormValues } from "../schema";

interface ServiceOrderLocationProps {
  control: Control<ServiceOrderFormValues>;
}

export function ServiceOrderLocation({ control }: ServiceOrderLocationProps) {
  return (
    <>
      <FormField
        control={control}
        name="machinery_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipamento</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o equipamento" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">Equipamento 1</SelectItem>
                <SelectItem value="2">Equipamento 2</SelectItem>
                <SelectItem value="3">Equipamento 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filial</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}