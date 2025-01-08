import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserList, User } from "@/components/users/UserList";
import { toast } from "sonner";

export function UserListContainer() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Buscar o company_id do usuário atual
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
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, company_id")
        .eq("company_id", currentUserProfile.company_id);

      // Buscar roles dos usuários
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      // Buscar dados dos usuários do auth
      const { data: authUsers } = await supabase.auth.admin.listUsers();

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

  const handleDelete = async (userId: string) => {
    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) throw authError;
      
      toast.success("Usuário excluído com sucesso!");
      fetchUsers();
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast.error(error.message || "Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserList
      users={users}
      onDelete={handleDelete}
      onEdit={(user) => {
        // This will be handled by the parent component
        console.log("Edit user:", user);
      }}
    />
  );
}