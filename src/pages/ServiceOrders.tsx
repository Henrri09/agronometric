import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const serviceOrders = [
  { 
    id: 1, 
    equipment: "Esteira Industrial X1000",
    type: "Preventiva",
    status: "Em andamento",
    priority: "Alta",
    dueDate: "2024-02-20"
  },
  { 
    id: 2, 
    equipment: "Empacotadora AutoPack",
    type: "Corretiva",
    status: "Pendente",
    priority: "Média",
    dueDate: "2024-02-25"
  },
  { 
    id: 3, 
    equipment: "Misturador Industrial",
    type: "Preventiva",
    status: "Concluída",
    priority: "Baixa",
    dueDate: "2024-02-15"
  },
];

export default function ServiceOrders() {
  return (
    <div className="p-6">
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as ordens de serviço do sistema"
      />
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data Limite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.equipment}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.priority}</TableCell>
                  <TableCell>{order.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}