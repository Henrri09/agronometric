import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Badge } from "@/components/ui/badge";

export default function ServiceOrders() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch service orders with proper profile join
  const { data: serviceOrders, isLoading } = useQuery({
    queryKey: ['serviceOrders'],
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

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceOrders'] });
      toast({
        title: "Ordem de serviço excluída",
        description: "A ordem de serviço foi excluída com sucesso.",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting service order:', error);
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a ordem de serviço.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string) => {
    setSelectedOrderId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedOrderId) {
      deleteMutation.mutate(selectedOrderId);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: "destructive",
      preventive: "secondary",
      corrective: "default",
      routine: "outline",
    } as const;

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "default"}>
        {priority}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      "in-progress": "default",
      completed: "outline",
      cancelled: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Ordens de Serviço"
          description="Gerencie todas as ordens de serviço do sistema"
        />
        <Button onClick={() => navigate("/service-orders/register")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Equipamento</TableHead>
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
                      onClick={() => navigate(`/service-orders/edit/${order.id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta ordem de serviço? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}