import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { StatusSection } from "./form-sections/StatusSection";
import { MaintenanceSection } from "./form-sections/MaintenanceSection";
import { PhotoSection } from "./form-sections/PhotoSection";
import { machineryFormSchema, type MachineryFormValues } from "./types";

interface MachineryFormProps {
  machinery?: Tables<"machinery"> | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MachineryForm({ machinery, onSuccess, onCancel }: MachineryFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const form = useForm<MachineryFormValues>({
    resolver: zodResolver(machineryFormSchema),
    defaultValues: {
      name: machinery?.name ?? "",
      model: machinery?.model ?? "",
      serial_number: machinery?.serial_number ?? "",
      status: machinery?.status as "active" | "maintenance" | "inactive" ?? "active",
      maintenance_frequency: 0,
    },
  });

  useEffect(() => {
    if (machinery?.id) {
      loadMachineryPhoto();
    }
  }, [machinery?.id]);

  const loadMachineryPhoto = async () => {
    if (!machinery?.id) return;

    const { data: files } = await supabase.storage
      .from('machinery_photos')
      .list(machinery.id);

    if (files && files.length > 0) {
      const { data: photoUrl } = supabase.storage
        .from('machinery_photos')
        .getPublicUrl(`${machinery.id}/${files[0].name}`);
      
      setCurrentPhotoUrl(photoUrl.publicUrl);
    }
  };

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
          const fileExt = photoFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${machinery.id}/${fileName}`;

          // Delete existing photos first
          const { data: existingFiles } = await supabase.storage
            .from('machinery_photos')
            .list(machinery.id);

          if (existingFiles) {
            await Promise.all(
              existingFiles.map((file) =>
                supabase.storage
                  .from('machinery_photos')
                  .remove([`${machinery.id}/${file.name}`])
              )
            );
          }

          const { error: uploadError } = await supabase.storage
            .from('machinery_photos')
            .upload(filePath, photoFile);

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
          const fileExt = photoFile.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `${newMachinery.id}/${fileName}`;

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
        <BasicInfoSection form={form} />
        <StatusSection form={form} />
        <MaintenanceSection form={form} />
        <PhotoSection
          photoFile={photoFile}
          currentPhotoUrl={currentPhotoUrl}
          onPhotoChange={setPhotoFile}
        />

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