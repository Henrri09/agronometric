import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Company {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  location: string;
  subscription_status: "active" | "inactive" | "trial";
  created_at: string;
  profiles: Array<{
    id: string;
    full_name: string;
  }>;
}

interface CompanyListProps {
  companies: Company[];
  onRefresh: () => void;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

export function CompanyList({ companies, onRefresh, onEdit, onDelete }: CompanyListProps) {
  const [deleteCompanyId, setDeleteCompanyId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "secondary";
      case "trial":
        return "outline";
      default:
        return "destructive";
    }
  };

  const handleDeleteClick = (companyId: string) => {
    setDeleteCompanyId(companyId);
  };

  const handleDeleteConfirm = () => {
    if (deleteCompanyId) {
      onDelete(deleteCompanyId);
      setDeleteCompanyId(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Administrador</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.cnpj}</TableCell>
              <TableCell>{company.address}</TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell>
                <Badge variant={getStatusColor(company.subscription_status)}>
                  {company.subscription_status}
                </Badge>
              </TableCell>
              <TableCell>
                {company.profiles?.[0]?.full_name || "Sem administrador"}
              </TableCell>
              <TableCell>
                {format(new Date(company.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(company)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteClick(company.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteCompanyId} onOpenChange={() => setDeleteCompanyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir essa empresa? Essa ação é irreversível.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}