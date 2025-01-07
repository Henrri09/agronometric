import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const machinery = [
  { 
    id: 1, 
    name: "Esteira Industrial X1000",
    model: "X1000-2023",
    serialNumber: "EST-001",
    status: "Em operação",
    lastMaintenance: "2024-01-15"
  },
  { 
    id: 2, 
    name: "Empacotadora AutoPack",
    model: "AP-2000",
    serialNumber: "EMP-002",
    status: "Em manutenção",
    lastMaintenance: "2024-02-01"
  },
  { 
    id: 3, 
    name: "Misturador Industrial",
    model: "MIX-500",
    serialNumber: "MIX-003",
    status: "Inativo",
    lastMaintenance: "2024-01-30"
  },
];

export default function Machinery() {
  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Maquinários"
        description="Gerencie todos os equipamentos cadastrados no sistema"
      />
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Número de Série</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Manutenção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {machinery.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>{machine.serialNumber}</TableCell>
                  <TableCell>{machine.status}</TableCell>
                  <TableCell>{machine.lastMaintenance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}