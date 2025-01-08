import { 
  Database, 
  DollarSign, 
  LineChart, 
  LifeBuoy,
  Home,
  Users,
  Tractor,
  BarChart2,
  Boxes,
  Calendar,
  Settings,
  BookOpen,
  ListTodo
} from "lucide-react";
import { MenuItemType } from "./types";

export const menuItems: MenuItemType[] = [
  { title: "Painel Empresa", icon: Home, path: "/" },
  { title: "Cadastro Usuário", icon: Users, path: "/users" },
  { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
  { title: "Inventário de peças", icon: Boxes, path: "/parts-inventory" },
  { title: "Cronograma de manutenção", icon: Calendar, path: "/maintenance-schedule" },
  { title: "Calendário", icon: Calendar, path: "/calendar" },
  { title: "Gestão de Tarefas", icon: ListTodo, path: "/task-management" },
  { title: "Configurações", icon: Settings, path: "/settings" },
  { title: "Documentação", icon: BookOpen, path: "/documentation" },
];

export const superAdminItems: MenuItemType[] = [
  { title: "Gestão de Empresas", icon: Database, path: "/super-admin" },
  { title: "Gestão Financeira", icon: DollarSign, path: "/super-admin/financial" },
  { title: "Analytics", icon: LineChart, path: "/super-admin/analytics" },
  { title: "Suporte", icon: LifeBuoy, path: "/super-admin/support" }
];