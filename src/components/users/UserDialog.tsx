import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserForm, UserFormValues } from "./UserForm";
import { User } from "./UserList";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  onSubmit: (data: UserFormValues) => Promise<void>;
}

export function UserDialog({ isOpen, onOpenChange, selectedUser, onSubmit }: UserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {selectedUser ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          defaultValues={selectedUser || undefined}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isEditing={!!selectedUser}
        />
      </DialogContent>
    </Dialog>
  );
}