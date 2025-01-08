import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ServiceOrderForm } from "@/components/service-orders/ServiceOrderForm";

export default function ServiceOrders() {
  const { toast } = useToast();
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: serviceOrders, refetch } = useQuery({
    queryKey: ['service-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          machinery:machinery_id(name),
          assigned_profile:profiles!service_orders_assigned_to_fkey(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!deleteOrderId) return;

    try {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', deleteOrderId);

      if (error) throw error;

      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso.",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting service order:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a ordem de serviço.",
        variant: "destructive",
      });
    } finally {
      setDeleteOrderId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge>Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="outline">Concluída</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      case 'medium':
        return <Badge variant="secondary">Média</Badge>;
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleFormSubmitSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as ordens de serviço do sistema"
      />

      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Ordem de Serviço
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Maquinário</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.title}</TableCell>
                  <TableCell>{order.machinery?.name}</TableCell>
                  <TableCell>{order.assigned_profile?.full_name}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{order.start_date ? new Date(order.start_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>{order.end_date ? new Date(order.end_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteOrderId(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <ServiceOrderForm onSuccess={handleFormSubmitSuccess} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteOrderId} onOpenChange={() => setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}