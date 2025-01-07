import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const mockOrders = [
  {
    id: "OS001",
    title: "Manutenção Preventiva - Esteira Principal",
    type: "Preventiva",
    status: "Em Andamento",
    machine: "Esteira Principal",
    requestedBy: "João Silva",
    date: "2024-01-15",
  },
  {
    id: "OS002",
    title: "Reparo - Tombador",
    type: "Corretiva",
    status: "Pendente",
    machine: "Tombador",
    requestedBy: "Maria Santos",
    date: "2024-01-16",
  },
];

export default function ServiceOrders() {
  return (
    <div className="p-6">
      <PageHeader
        title="Ordens de Serviço"
        description="Gerencie todas as ordens de serviço e manutenções"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button variant="outline">Todas</Button>
          <Button variant="outline">Pendentes</Button>
          <Button variant="outline">Em Andamento</Button>
          <Button variant="outline">Concluídas</Button>
        </div>
        
        <Link to="/service-orders/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ordem de Serviço
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Tipo</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Equipamento</th>
              <th className="text-left p-4">Solicitante</th>
              <th className="text-left p-4">Data</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="p-4">{order.id}</td>
                <td className="p-4">{order.title}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.type === "Preventiva"
                      ? "bg-primary/20 text-primary"
                      : "bg-warning/20 text-warning"
                  }`}>
                    {order.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === "Em Andamento"
                      ? "bg-warning/20 text-warning"
                      : "bg-muted/20 text-muted-foreground"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">{order.machine}</td>
                <td className="p-4">{order.requestedBy}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm" className="mr-2">
                    Visualizar
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