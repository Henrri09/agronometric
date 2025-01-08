import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PhotoUpload } from "./PhotoUpload";
import { machineryFormSchema, type MachineryFormProps, type MachineryFormValues } from "./types";

export function MachineryForm({ machinery, onSuccess, onCancel }: MachineryFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<MachineryFormValues>({
    resolver: zodResolver(machineryFormSchema),
    defaultValues: {
      name: machinery?.name ?? "",
      model: machinery?.model ?? "",
      serial_number: machinery?.serial_number ?? "",
      status: machinery?.status as "active" | "maintenance" | "inactive" ?? "active",
      maintenance_frequency: 0, // Changed to number to match the schema
    },
  });

  const onSubmit = async (data: MachineryFormValues) => {
    try {
      setIsUploading(true);

      if (machinery) {
        // Update existing machinery
        const { error: updateError } = await supabase
          .from('machinery')
          .update({
            name: data.name,
            model: data.model,
            serial_number: data.serial_number,
            status: data.status,
          })
          .eq('id', machinery.id);

        if (updateError) throw updateError;

        // If there's a new photo, upload it
        if (photoFile) {
          const fileExt = photoFile.name.split('.').pop() as string;
          const filePath = `${machinery.id}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('machinery_photos')
            .upload(filePath, photoFile, { upsert: true });

          if (uploadError) throw uploadError;
        }

        // Update maintenance schedule if frequency is provided
        if (data.maintenance_frequency > 0) {
          const nextMaintenanceDate = new Date();
          nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + data.maintenance_frequency);

          const { error: scheduleError } = await supabase
            .from('maintenance_schedules')
            .upsert({
              machinery_id: machinery.id,
              frequency_days: data.maintenance_frequency,
              next_maintenance_date: nextMaintenanceDate.toISOString(),
            });

          if (scheduleError) throw scheduleError;
        }

        toast({
          title: "Sucesso",
          description: "Maquinário atualizado com sucesso",
        });
      } else {
        // Create new machinery
        const { data: newMachinery, error: machineryError } = await supabase
          .from('machinery')
          .insert({
            name: data.name,
            model: data.model,
            serial_number: data.serial_number,
            status: data.status,
          })
          .select()
          .single();

        if (machineryError) throw machineryError;

        // If there's a photo, upload it
        if (photoFile && newMachinery) {
          const fileExt = photoFile.name.split('.').pop() as string;
          const filePath = `${newMachinery.id}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('machinery_photos')
            .upload(filePath, photoFile);

          if (uploadError) throw uploadError;
        }

        // Create maintenance schedule if frequency is provided
        if (data.maintenance_frequency > 0 && newMachinery) {
          const nextMaintenanceDate = new Date();
          nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + data.maintenance_frequency);

          const { error: scheduleError } = await supabase
            .from('maintenance_schedules')
            .insert({
              machinery_id: newMachinery.id,
              frequency_days: data.maintenance_frequency,
              next_maintenance_date: nextMaintenanceDate.toISOString(),
            });

          if (scheduleError) throw scheduleError;
        }

        toast({
          title: "Sucesso",
          description: "Maquinário cadastrado com sucesso",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error creating/updating machinery:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar maquinário",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do maquinário" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o modelo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serial_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Série</FormLabel>
              <FormControl>
                <Input placeholder="Digite o número de série" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <PhotoUpload onPhotoSelect={setPhotoFile} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {machinery ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}