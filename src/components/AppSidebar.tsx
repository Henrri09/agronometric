import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Tractor, ClipboardList, Users, BarChart2, Settings, KanbanSquare } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { title: "Painel Empresa", icon: Home, path: "/" },
  { title: "Cadastro Usuário", icon: Users, path: "/users" },
  { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery" },
  { title: "Ordem de Serviço", icon: ClipboardList, path: "/service-orders" },
  { title: "Kanban", icon: KanbanSquare, path: "/kanban" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
  { title: "Configurações", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <img 
            src="/lovable-uploads/5c1d0c82-91bb-4749-b5fb-5a6b7bcdc237.png" 
            alt="AgroMetric" 
            className="h-8 w-auto"
          />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}