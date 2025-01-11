import {
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
  Calendar,
  BarChart,
  Boxes,
  ClipboardList,
  BookOpen,
  Ticket,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    role: "visitor",
  },
  {
    title: "Maquinário",
    href: "/machinery",
    icon: Wrench,
    role: "visitor",
  },
  {
    title: "Ordens de Serviço",
    href: "/service-orders",
    icon: ClipboardList,
    role: "common",
  },
  {
    title: "Calendário",
    href: "/calendar",
    icon: Calendar,
    role: "visitor",
  },
  {
    title: "Estoque de Peças",
    href: "/parts-inventory",
    icon: Boxes,
    role: "visitor",
  },
  {
    title: "Tickets",
    href: "/tickets",
    icon: Ticket,
    role: "common",
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
    role: "common",
  },
  {
    title: "Documentação",
    href: "/documentation",
    icon: BookOpen,
    role: "visitor",
  },
  {
    title: "Usuários",
    href: "/users",
    icon: Users,
    role: "admin",
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: Settings,
    role: "admin",
  },
];