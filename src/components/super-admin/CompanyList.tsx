import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
}

export function CompanyList({ companies }: CompanyListProps) {
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

  return (
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}