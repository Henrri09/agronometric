import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Camera, Upload, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const machineryFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  model: z.string().min(2, "Modelo deve ter no mínimo 2 caracteres"),
  serial_number: z.string().optional(),
  status: z.enum(["active", "maintenance", "inactive"]),
  maintenance_frequency: z.string().transform((val) => Number(val)).pipe(z.number().positive("Frequência deve ser maior que 0")),
});

type MachineryFormValues = z.infer<typeof machineryFormSchema>;

interface MachineryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function MachineryForm({ onSuccess, onCancel }: MachineryFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const form = useForm<MachineryFormValues>({
    resolver: zodResolver(machineryFormSchema),
    defaultValues: {
      name: "",
      model: "",
      serial_number: "",
      status: "active",
      maintenance_frequency: "",
    },
  });

  const handlePhotoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Create video element to show stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Wait a bit for video to initialize
      setTimeout(() => {
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to file
          canvas.toBlob((blob) => {
            if (blob) {
              const file = new File([blob], "machinery-photo.jpg", { type: "image/jpeg" });
              setPhotoFile(file);
            }
            // Stop camera
            stream.getTracks().forEach(track => track.stop());
          }, 'image/jpeg');
        }
      }, 300);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const onSubmit = async (data: MachineryFormValues) => {
    try {
      setIsUploading(true);

      // First insert the machinery data
      const { data: machinery, error: machineryError } = await supabase
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
      if (photoFile && machinery) {
        const fileExt = photoFile.name.split('.').pop() as string;
        const filePath = `${machinery.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('machinery_photos')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;
      }

      // Create maintenance schedule if frequency is provided
      if (data.maintenance_frequency) {
        const { error: scheduleError } = await supabase
          .from('maintenance_schedules')
          .insert({
            machinery_id: machinery.id,
            frequency_days: data.maintenance_frequency,
            next_maintenance_date: new Date(Date.now() + data.maintenance_frequency * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (scheduleError) throw scheduleError;
      }

      toast({
        title: "Sucesso",
        description: "Maquinário cadastrado com sucesso",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error creating machinery:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar maquinário",
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
                <Input type="number" placeholder="Digite a frequência em dias" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Foto do Maquinário</FormLabel>
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            {isMobile && (
              <Button type="button" variant="outline" onClick={handlePhotoCapture}>
                <Camera className="w-4 h-4 mr-2" />
                Fotografar
              </Button>
            )}
          </div>
          {photoFile && (
            <p className="text-sm text-muted-foreground">
              Foto selecionada: {photoFile.name}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Cadastrar
          </Button>
        </div>
      </form>
    </Form>
  );
}