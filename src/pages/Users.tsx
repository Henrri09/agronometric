import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserFormValues } from "@/components/users/UserForm";
import { UserList, User } from "@/components/users/UserList";
import { UserDialog } from "@/components/users/UserDialog";

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
      
      setIsAdmin(roles?.role === "admin");
    }
  };

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      const combinedUsers = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        const role = userRole?.role;
        
        if (role === "super_admin") return null;
        
        return {
          id: profile.id,
          email: "",
          full_name: profile.full_name || "",
          role: (role as "admin" | "common" | "visitor") || "visitor",
        };
      }).filter((user): user is User => user !== null) || [];

      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(error.message || "Erro ao carregar usuários");
    }
  };

  const handleSubmit = async (data: UserFormValues) => {
    try {
      if (selectedUser) {
        // Update existing user
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
        setIsDialogOpen(false);
        setSelectedUser(null);
      } else {
        // Create new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.full_name,
            },
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (signUpData.user) {
          // Set user role
          const { error: roleError } = await supabase
            .from("user_roles")
            .insert({
              user_id: signUpData.user.id,
              role: data.role
            });

          if (roleError) throw roleError;

          toast.success("Usuário criado com sucesso! Um email de confirmação foi enviado.");
          setIsDialogOpen(false);
          setSelectedUser(null);
          await fetchUsers();
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || "Erro ao salvar usuário");
      throw error;
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      // Delete user role first
      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (roleError) throw roleError;

      // Delete profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) throw profileError;

      // Delete auth user using edge function
      const { error: deleteError } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (deleteError) throw deleteError;
      
      toast.success("Usuário excluído com sucesso!");
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
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

      <UserDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedUser={selectedUser}
        onSubmit={handleSubmit}
      />
    </div>
  );
}