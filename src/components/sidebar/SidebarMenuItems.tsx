import { Home, Tractor, ClipboardList, Users, BarChart2, Settings, Calendar, Boxes, BookOpen } from "lucide-react";

export const menuItems = [
  { title: "Painel Empresa", icon: Home, path: "/", adminOnly: false },
  { title: "Cadastro Usuário", icon: Users, path: "/users", adminOnly: true },
  { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery", adminOnly: true },
  { title: "Ordem de Serviço", icon: ClipboardList, path: "/service-orders", adminOnly: false },
  { title: "Analytics", icon: BarChart2, path: "/analytics", adminOnly: true },
  { title: "Inventário de peças", icon: Boxes, path: "/parts-inventory", adminOnly: true },
  { title: "Cronograma de manutenção", icon: Calendar, path: "/maintenance-schedule", adminOnly: true },
  { title: "Calendário", icon: Calendar, path: "/calendar", adminOnly: false },
  { title: "Configurações", icon: Settings, path: "/settings", adminOnly: true },
  { title: "Documentação", icon: BookOpen, path: "/documentation", adminOnly: false },
];