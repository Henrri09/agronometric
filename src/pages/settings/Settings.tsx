import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/hooks/useCompanyId";
import { toast } from "sonner";

const settingsFormSchema = z.object({
  companyName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  tons_per_hour: z.string().min(1),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function Settings() {

  const { companyId } = useCompanyId();

  console.log(companyId, 'companyId');

  const { data: settings, refetch, isLoading } = useQuery({
    queryKey: ['settings', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (error) throw error;

      if (data) {
        form.setValue('companyName', data.name);
        form.setValue('email', data.email);
        form.setValue('phone', data.phone);
        form.setValue('tons_per_hour', data.tons_per_hour);
      }
    },
  });


  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      companyName: "",
      email: "",
      phone: "",
      tons_per_hour: "",
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    const { companyName, email, phone, tons_per_hour } = data;

    const { data: updatedData, error } = await supabase
      .from('companies')
      .update({ name: companyName, email, phone, tons_per_hour })
      .eq('id', companyId)
      .single();

    if (error) {
      toast.error("Erro ao atualizar configurações");
      return;
    }

    toast.success("Configurações atualizadas com sucesso");

    refetch();
  };


  return (
    <div className="p-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre ordens de serviço
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas do Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre manutenções preventivas
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome da empresa" name={field.name} value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o email" name={field.name} value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o telefone" name={field.name} value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tons_per_hour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Toneladas por Hora</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a quantidade de toneladas por hora que a empresa produz" name={field.name} value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}