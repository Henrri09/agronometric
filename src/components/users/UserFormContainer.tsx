import { useState } from "react";
import { User } from "@/components/users/UserList";
import { UserForm, UserFormValues } from "@/components/users/UserForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserFormContainerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
  onUserSaved: () => void;
}

export function UserFormContainer({
  isOpen,
  onClose,
  selectedUser,
  onUserSaved,
}: UserFormContainerProps) {
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

      onClose();
      onUserSaved();
    } catch (error: any) {
      console.error("Erro ao salvar usuário:", error);
      toast.error(error.message || "Erro ao salvar usuário");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={selectedUser || undefined}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isEditing={!!selectedUser}
        />
      </DialogContent>
    </Dialog>
  );
}