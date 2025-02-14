import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { ServiceOrderFormValues } from "../schema";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyId } from "@/components/dashboard/CompanyIdProvider";
interface ServiceOrderBasicInfoProps {
  control: Control<ServiceOrderFormValues>;
}

export function ServiceOrderBasicInfo({ control }: ServiceOrderBasicInfoProps) {
  // Fetch users list

  const { companyId } = useCompanyId();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .order('full_name');

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-semibold">Informações Básicas</h2>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="assigned_to"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuário Responsável</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="requester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solicitante</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição da Falha / Serviço Solicitado</FormLabel>
            <FormControl>
              <Textarea {...field} className="min-h-[100px]" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}