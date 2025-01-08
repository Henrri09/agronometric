import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserForm, UserFormValues } from "@/components/users/UserForm";
import { UserList, User } from "@/components/users/UserList";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    fetchUsers();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setIsAdmin(roles?.role === "admin" || roles?.role === "super_admin");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Primeiro, buscar o company_id do usuário atual
      const { data: currentUserProfile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", session.user.id)
        .single();

      if (!currentUserProfile?.company_id) {
        toast.error("Erro ao identificar a empresa do usuário");
        return;
      }

      // Buscar todos os perfis da mesma empresa
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, company_id")
        .eq("company_id", currentUserProfile.company_id);

      if (profilesError) throw profilesError;

      // Buscar roles dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Buscar dados dos usuários do auth
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;

      // Combinar os dados
      const combinedUsers = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        const authUser = authUsers?.users.find(user => user.id === profile.id);
        
        return {
          id: profile.id,
          email: authUser?.email || "",
          full_name: profile.full_name || "",
          role: userRole?.role || "visitor",
        };
      }) || [];

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast.error(error.message || "Erro ao carregar usuários");
    }
  };

  const handleSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Atualizar usuário existente
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error("Usuário não autenticado");

        // Buscar company_id do usuário atual
        const { data: currentUserProfile } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", session.user.id)
          .single();

        if (!currentUserProfile?.company_id) {
          throw new Error("Empresa não encontrada");
        }

        // Criar novo usuário
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password!,
          email_confirm: true,
          user_metadata: {
            full_name: data.full_name,
          },
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Criar perfil com company_id
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ 
              full_name: data.full_name,
              company_id: currentUserProfile.company_id 
            })
            .eq("id", authData.user.id);

          if (profileError) throw profileError;

          // Criar role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert([
              { user_id: authData.user.id, role: data.role }
            ]);

          if (roleError) throw roleError;
        }

        toast.success("Usuário criado com sucesso!");
      }

      setIsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // Primeiro deletar o usuário no auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
      
      toast.success("Usuário excluído com sucesso!");
      fetchUsers();
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
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
          <UserList
            users={users}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Editar Usuário" : "Novo Usuário"}
            </DialogTitle>
          </DialogHeader>
          <UserForm
            defaultValues={selectedUser || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsDialogOpen(false)}
            isEditing={!!selectedUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}