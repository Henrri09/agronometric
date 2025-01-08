import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MachinerySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function MachinerySearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: MachinerySearchProps) {
  return (
    <div className="flex gap-4 flex-1 max-w-2xl">
      <div className="flex-1 relative">
        <Input
          placeholder="Buscar por nome, modelo ou número de série"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10"
        />
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          <SelectItem value="active">Em operação</SelectItem>
          <SelectItem value="maintenance">Em manutenção</SelectItem>
          <SelectItem value="inactive">Inativo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}