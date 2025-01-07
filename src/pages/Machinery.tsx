import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockMachinery = [
  {
    name: "Estrusora ergométrica",
    model: "04887",
    serialNumber: "25252305547",
    status: "Ativo",
    lastMaintenance: "-",
    frequency: "60 dias",
  },
  {
    name: "Tombador",
    model: "04857",
    serialNumber: "2525230580",
    status: "Ativo",
    lastMaintenance: "-",
    frequency: "30 dias",
  },
];

export default function Machinery() {
  return (
    <div className="p-6">
      <PageHeader
        title="Maquinários"
        description="Gerencie todos os equipamentos e maquinários da sua indústria"
      />
      
      <div className="flex justify-end mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Maquinário
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Nome</th>
              <th className="text-left p-4">Modelo</th>
              <th className="text-left p-4">Número de Série</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Última Manutenção</th>
              <th className="text-left p-4">Frequência (dias)</th>
              <th className="text-left p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockMachinery.map((machine, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{machine.name}</td>
                <td className="p-4">{machine.model}</td>
                <td className="p-4">{machine.serialNumber}</td>
                <td className="p-4">
                  <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm">
                    {machine.status}
                  </span>
                </td>
                <td className="p-4">{machine.lastMaintenance}</td>
                <td className="p-4">{machine.frequency}</td>
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