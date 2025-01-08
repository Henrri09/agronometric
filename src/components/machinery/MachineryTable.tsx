import { Tables } from "@/integrations/supabase/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface MachineryWithPhoto extends Tables<"machinery"> {
  photo_url?: string | null;
}

interface MachineryTableProps {
  machinery: MachineryWithPhoto[] | undefined;
  onEdit: (machine: MachineryWithPhoto) => void;
  onDelete: (machine: MachineryWithPhoto) => void;
}

export function MachineryTable({ machinery, onEdit, onDelete }: MachineryTableProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Em operação';
      case 'maintenance':
        return 'Em manutenção';
      case 'inactive':
        return 'Inativo';
      default:
        return status;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Foto</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Número de Série</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {machinery?.map((machine) => (
          <TableRow key={machine.id}>
            <TableCell>
              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                {machine.photo_url ? (
                  <img
                    src={machine.photo_url}
                    alt={machine.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sem foto
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>{machine.name}</TableCell>
            <TableCell>{machine.model}</TableCell>
            <TableCell>{machine.serial_number}</TableCell>
            <TableCell>{getStatusText(machine.status)}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(machine)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(machine)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}