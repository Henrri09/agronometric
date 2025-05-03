import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TablesInsert } from "@/integrations/supabase/types";
import { format } from "date-fns";

const formSchema = z.object({
  machinery_id: z.string().min(1, "Selecione um maquinário"),
  frequency_days: z.number().min(1, "Frequência deve ser maior que 0"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MaintenanceSchedule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      machinery_id: "",
      frequency_days: 30,
      description: "",
    },
  });

  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["maintenance-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("maintenance_schedules")
        .select(`
          *,
          machinery:machinery_id (
            name,
            model
          )
        `)
        .order("next_maintenance_date");

      if (error) throw error;
      return data;
    },
  });

  const { data: machinery, isLoading: isLoadingMachinery } = useQuery({
    queryKey: ["machinery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("machinery")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const createSchedule = useMutation({
    mutationFn: async (values: FormValues) => {
      const today = new Date();
      const nextMaintenanceDate = new Date();
      nextMaintenanceDate.setDate(today.getDate() + values.frequency_days);

      const insertData: TablesInsert<"maintenance_schedules"> = {
        machinery_id: values.machinery_id,
        frequency_days: values.frequency_days,
        description: values.description || null,
        next_maintenance_date: nextMaintenanceDate.toISOString().split('T')[0],
      };

      const { error } = await supabase
        .from("maintenance_schedules")
        .insert([insertData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-schedules"] });
      toast({
        title: "Sucesso",
        description: "Agendamento criado com sucesso",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar agendamento: " + error.message,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createSchedule.mutate(values);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Agendamento de Manutenção"
        description="Gerencie os agendamentos de manutenção preventiva"
      />

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Agendamento</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="machinery_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maquinário</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full border rounded-md h-10 px-3"
                        >
                          <option value="">Selecione um maquinário</option>
                          {machinery?.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} {m.model ? `(${m.model})` : ''}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência (dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Criar Agendamento
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Maquinário</TableHead>
                <TableHead>Próxima Manutenção</TableHead>
                <TableHead>Frequência (dias)</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingSchedules || isLoadingMachinery ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : schedules?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nenhum agendamento cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                schedules?.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      {schedule.machinery?.name} 
                      {schedule.machinery?.model && ` (${schedule.machinery.model})`}
                    </TableCell>
                    <TableCell>
                      {schedule.next_maintenance_date && 
                        format(new Date(schedule.next_maintenance_date), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{schedule.frequency_days} dias</TableCell>
                    <TableCell>{schedule.description}</TableCell>
                    <TableCell>
                      {schedule.next_maintenance_date && new Date(schedule.next_maintenance_date) <= new Date() ? (
                        <span className="text-destructive font-medium">
                          Manutenção Pendente
                        </span>
                      ) : (
                        <span className="text-success font-medium">
                          Em Dia
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}