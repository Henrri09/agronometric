import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MachineryForm } from "@/components/machinery/MachineryForm";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Machinery = Tables<"machinery">;

export default function Machinery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMachinery, setSelectedMachinery] = useState<Machinery | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: machinery, refetch } = useQuery({
    queryKey: ['machinery'],
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
      return data;
    },
  });

  const handleEdit = (machine: Machinery) => {
    setSelectedMachinery(machine);
    setIsDialogOpen(true);
  };

  const handleDelete = async (machine: Machinery) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Em operação';
      case 'maintenance':
        return 'Em manutenção';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  const getMachineryPhoto = async (machineId: string) => {
    const { data } = await supabase.storage
      .from('machinery_photos')
      .list(machineId);

    if (data && data.length > 0) {
      const { data: photoUrl } = supabase.storage
        .from('machinery_photos')
        .getPublicUrl(`${machineId}/${data[0].name}`);
      
      return photoUrl.publicUrl;
    }
    return null;
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Maquinários"
        description="Gerencie todos os equipamentos cadastrados no sistema"
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4 flex-1 max-w-2xl">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nome, modelo ou número de série"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="active">Em operação</SelectItem>
              <SelectItem value="maintenance">Em manutenção</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Maquinário
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Foto</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de Série</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machinery?.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                      {machine.photo_url ? (
                        <img
                          src={machine.photo_url}
                          alt={machine.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Sem foto
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serial_number}</TableCell>
                  <TableCell>{getStatusText(machine.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(machine)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedMachinery(machine);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este maquinário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMachinery && handleDelete(selectedMachinery)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}