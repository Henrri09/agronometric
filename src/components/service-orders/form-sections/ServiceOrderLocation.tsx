import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Control } from "react-hook-form";
import { ServiceOrderFormValues } from "../schema";

interface ServiceOrderLocationProps {
  control: Control<ServiceOrderFormValues>;
}

export function ServiceOrderLocation({ control }: ServiceOrderLocationProps) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Informações do Equipamento</h2>
      
      <FormField
        control={control}
        name="machinery_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipamento</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
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

      <div className="space-y-2">
        <FormLabel>Fotos do Equipamento</FormLabel>
        <Button type="button" variant="outline" className="w-32">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="space-y-2">
        <FormLabel>Fotos do Problema</FormLabel>
        <Button type="button" variant="outline" className="w-32">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>
    </div>
  );
}