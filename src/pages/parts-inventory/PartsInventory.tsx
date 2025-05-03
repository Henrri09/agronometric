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
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TablesInsert } from "@/integrations/supabase/types";
import { useCompanyId } from "@/hooks/useCompanyId";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantidade não pode ser negativa"),
  minimum_quantity: z.number().min(0, "Quantidade mínima não pode ser negativa"),
  unit_price: z.number().min(0, "Preço não pode ser negativo"),
  supplier: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PartsInventory() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { companyId } = useCompanyId();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      quantity: 0,
      minimum_quantity: 5,
      unit_price: 0,
      supplier: "",
    },
  });

  const { data: parts, isLoading } = useQuery({
    queryKey: ["parts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parts_inventory")
        .select("*")
        .order("name")
        .eq('company_id', companyId);
      if (error) throw error;
      return data;
    },
  });

  const createPart = useMutation({
    mutationFn: async (values: FormValues) => {
      const insertData: TablesInsert<"parts_inventory"> = {
        name: values.name,
        company_id: companyId,
        description: values.description || null,
        quantity: values.quantity,
        minimum_quantity: values.minimum_quantity,
        unit_price: values.unit_price,
        supplier: values.supplier || null,
      };

      const { error } = await supabase
        .from("parts_inventory")
        .insert([insertData]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast({
        title: "Sucesso",
        description: "Peça cadastrada com sucesso",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao cadastrar peça: " + error.message,
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    createPart.mutate(values);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Estoque de Peças"
        description="Gerencie o estoque de peças e componentes"
      />

      <div className="mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" />
              Nova Peça
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Peça</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
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
                    name="minimum_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade Mínima</FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Unitário</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
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
                  name="supplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Cadastrar
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
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Quantidade Mínima</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : parts?.length === 0 ? (
                <TableRow>
                  <TableCell style={{ height: 100 }} colSpan={7} className="text-center">
                    Nenhuma peça cadastrada
                  </TableCell>
                </TableRow>
              ) : (
                parts?.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.description}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>{part.minimum_quantity}</TableCell>
                    <TableCell>
                      {part.unit_price?.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </TableCell>
                    <TableCell>{part.supplier}</TableCell>
                    <TableCell>
                      {part.quantity <= part.minimum_quantity ? (
                        <span className="text-destructive font-medium">
                          Estoque Baixo
                        </span>
                      ) : (
                        <span className="text-success font-medium">
                          Em Estoque
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