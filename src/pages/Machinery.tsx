import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MachineryForm } from "@/components/machinery/MachineryForm";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Machinery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: machinery, refetch } = useQuery({
    queryKey: ['machinery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('machinery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Gestão de Maquinários"
        description="Gerencie todos os equipamentos cadastrados no sistema"
      />
      
      <div className="flex justify-end">
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
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de Série</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machinery?.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serial_number}</TableCell>
                  <TableCell>{getStatusText(machine.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Novo Maquinário</DialogTitle>
          </DialogHeader>
          <MachineryForm
            onSuccess={() => {
              setIsDialogOpen(false);
              refetch();
            }}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}