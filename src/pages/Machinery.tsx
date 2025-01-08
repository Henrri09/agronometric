import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MachineryForm } from "@/components/machinery/MachineryForm";
import { MachinerySearch } from "@/components/machinery/MachinerySearch";
import { MachineryTable } from "@/components/machinery/MachineryTable";
import { DeleteMachineryDialog } from "@/components/machinery/DeleteMachineryDialog";

interface MachineryWithPhoto extends Tables<"machinery"> {
  photo_url?: string | null;
}

export default function Machinery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState<Tables<"machinery"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: machinery, refetch } = useQuery({
    queryKey: ['machinery', searchTerm, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('machinery')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,serial_number.ilike.%${searchTerm}%`);
      }

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) throw error;

      const machineryWithPhotos: MachineryWithPhoto[] = await Promise.all(
        data.map(async (machine) => {
          const { data: files } = await supabase.storage
            .from('machinery_photos')
            .list(machine.id);

          let photo_url = null;
          if (files && files.length > 0) {
            const { data: photoUrl } = supabase.storage
              .from('machinery_photos')
              .getPublicUrl(`${machine.id}/${files[0].name}`);
            photo_url = photoUrl.publicUrl;
          }

          return { ...machine, photo_url };
        })
      );

      return machineryWithPhotos;
    },
  });

  const handleEdit = (machine: MachineryWithPhoto) => {
    setSelectedMachinery(machine);
    setIsDialogOpen(true);
  };

  const handleDelete = async (machine: MachineryWithPhoto) => {
    try {
      const { error } = await supabase
        .from('machinery')
        .delete()
        .eq('id', machine.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Maquinário excluído com sucesso",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting machinery:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir maquinário",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMachinery(null);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Maquinários"
        description="Gerencie todos os equipamentos cadastrados no sistema"
      />
      
      <div className="flex justify-between items-center mb-4">
        <MachinerySearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Maquinário
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <MachineryTable
            machinery={machinery}
            onEdit={handleEdit}
            onDelete={(machine) => {
              setSelectedMachinery(machine);
              setIsDeleteDialogOpen(true);
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedMachinery ? 'Editar Maquinário' : 'Novo Maquinário'}
            </DialogTitle>
          </DialogHeader>
          <MachineryForm
            machinery={selectedMachinery}
            onSuccess={() => {
              handleCloseDialog();
              refetch();
            }}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <DeleteMachineryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => selectedMachinery && handleDelete(selectedMachinery)}
        machinery={selectedMachinery}
      />
    </div>
  );
}