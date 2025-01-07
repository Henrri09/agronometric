import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const userFormSchema = z.object({
  email: z.string().email("Email inválido"),
  full_name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  role: z.enum(["admin", "common", "visitor"]),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: "admin" | "common" | "visitor";
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      full_name: "",
      role: "visitor",
      password: "",
    },
  });

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      form.reset({
        email: selectedUser.email,
        full_name: selectedUser.full_name || "",
        role: selectedUser.role,
        password: "", // Não preenchemos a senha ao editar
      });
    } else {
      form.reset({
        email: "",
        full_name: "",
        role: "visitor",
        password: "",
      });
    }
  }, [selectedUser, form]);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setIsAdmin(roles?.role === "admin");
    }
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name");

    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    const { data: authUsers } = await supabase.auth.admin.listUsers();

    if (profiles && userRoles && authUsers.users) {
      const mergedUsers = authUsers.users.map(authUser => {
        const profile = profiles.find(p => p.id === authUser.id);
        const userRole = userRoles.find(ur => ur.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || "",
          full_name: profile?.full_name,
          role: userRole?.role || "visitor",
        };
      });
      setUsers(mergedUsers);
    }
  };

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Atualizar usuário existente
        const updates = {
          email: data.email,
          full_name: data.full_name,
        };

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: data.full_name })
          .eq("id", selectedUser.id);

        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from("user_roles")
          .update({ role: data.role })
          .eq("user_id", selectedUser.id);

        if (roleError) throw roleError;

        toast.success("Usuário atualizado com sucesso!");
      } else {
        // Criar novo usuário
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: data.role })
            .eq("user_id", authData.user.id);

          if (roleError) throw roleError;
        }

        toast.success("Usuário criado com sucesso!");
      }

      setIsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      
      toast.success("Usuário excluído com sucesso!");
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir usuário");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Usuários"
        description="Gerencie os usuários do sistema e suas permissões"
      />
      
      <div className="mb-4">
        <Button
          onClick={() => {
            setSelectedUser(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="common">Comum</SelectItem>
                        <SelectItem value="visitor">Visitante</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!selectedUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {selectedUser ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}