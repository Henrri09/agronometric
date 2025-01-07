import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockUsers = [
  {
    name: "Marcelo Santana",
    email: "marcelo.santana@yogha.com.br",
    role: "Usuário",
  },
  {
    name: "Marcelo Santana",
    email: "marcelosantana.py@gmail.com",
    role: "Administrador",
  },
];

export default function Users() {
  return (
    <div className="p-6">
      <PageHeader
        title="Usuários"
        description="Gerencie todos os usuários e suas permissões no sistema"
      />
      
      <div className="flex justify-end mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Função</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.role === "Administrador" 
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary/20 text-secondary"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" className="mr-2">
                    Editar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}