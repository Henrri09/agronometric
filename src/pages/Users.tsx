import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
  { id: 1, name: "João Silva", email: "joao@agrometric.com", role: "Administrador", status: "Ativo" },
  { id: 2, name: "Maria Santos", email: "maria@agrometric.com", role: "Operador", status: "Ativo" },
  { id: 3, name: "Pedro Souza", email: "pedro@agrometric.com", role: "Técnico", status: "Inativo" },
];

export default function Users() {
  return (
    <div className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}