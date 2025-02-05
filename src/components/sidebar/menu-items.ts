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
  HeartHandshake,
  BookCheck,
  LineChart,
  ListTodo,
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
    title: "Gerenciamento de Tarefas",
    href: "/task-management",
    icon: ListTodo,
    role: "visitor",
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

export const superAdminItems = [
  {
    title: "Dashboard",
    href: "/super-admin",
    icon: LayoutDashboard,
    role: "super_admin",
  },
  {
    title: "Suporte",
    href: "/super-admin/support",
    icon: HeartHandshake,
    role: "super_admin",
  },
  {
    title: "Tutoriais",
    href: "/super-admin/tutorials",
    icon: BookCheck,
    role: "super_admin",
  },
  {
    title: "Analytics",
    href: "/super-admin/analytics",
    icon: LineChart,
    role: "super_admin",
  },
];