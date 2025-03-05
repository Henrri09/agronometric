import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Plus } from "lucide-react";
import { Control } from "react-hook-form";
import { ServiceOrderFormValues } from "../schema";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MachineryForm } from "@/components/machinery/MachineryForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/components/dashboard/CompanyIdProvider";
interface ServiceOrderLocationProps {
  control: Control<ServiceOrderFormValues>;
}

export function ServiceOrderLocation({ control }: ServiceOrderLocationProps) {
  const isMobile = useIsMobile();
  const [isNewMachineryDialogOpen, setIsNewMachineryDialogOpen] = useState(false);
  const { companyId } = useCompanyId();
  // Fetch machinery list
  const { data: machinery, refetch: refetchMachinery } = useQuery({
    queryKey: ['machinery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machinery')
        .select('*')
        .eq('company_id', companyId)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const handleCameraCapture = async (inputId: string) => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';

      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          console.log(`Photo captured for ${inputId}:`, file);
          // Here you would handle the file upload to your storage
        }
      };

      input.click();
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Informações do Equipamento</h2>

      <FormField
        control={control}
        name="machinery_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Equipamento</FormLabel>
            <div className="flex gap-2">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione o equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {machinery?.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name} - {machine.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewMachineryDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo
              </Button>
            </div>
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
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="w-32">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          {isMobile && (
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => handleCameraCapture('machinery-photo')}
            >
              <Camera className="w-4 h-4 mr-2" />
              Câmera
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <FormLabel>Fotos do Problema</FormLabel>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" className="w-32">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          {isMobile && (
            <Button
              type="button"
              variant="outline"
              className="w-32"
              onClick={() => handleCameraCapture('problem-photo')}
            >
              <Camera className="w-4 h-4 mr-2" />
              Câmera
            </Button>
          )}
        </div>
      </div>

      <Dialog open={isNewMachineryDialogOpen} onOpenChange={setIsNewMachineryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Equipamento</DialogTitle>
          </DialogHeader>
          <MachineryForm
            onSuccess={() => {
              setIsNewMachineryDialogOpen(false);
              refetchMachinery();
            }}
            onCancel={() => setIsNewMachineryDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}