import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Home, Tractor, ClipboardList, Users, BarChart2, Settings, KanbanSquare, Calendar, Boxes } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { title: "Painel Empresa", icon: Home, path: "/" },
  { title: "Cadastro Usuário", icon: Users, path: "/users" },
  { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery" },
  { title: "Ordem de Serviço", icon: ClipboardList, path: "/service-orders" },
  { title: "Gestão de Tarefas", icon: KanbanSquare, path: "/task-management" },
  { title: "Calendário", icon: Calendar, path: "/calendar" },
  { title: "Analytics", icon: BarChart2, path: "/analytics" },
  { title: "Inventário de peças", icon: Boxes, path: "/parts-inventory" },
  { title: "Cronograma de manutenção", icon: Calendar, path: "/maintenance-schedule" },
  { title: "Configurações", icon: Settings, path: "/settings" },
];

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <div className="bg-background border-r">
        <Sidebar className="!bg-background">
          <SidebarContent>
            <div className="p-4 flex items-center justify-between">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setOpenMobile(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              )}
            </div>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.path} 
                          className="flex items-center gap-2"
                          onClick={() => isMobile && setOpenMobile(false)}
                        >
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
      </div>
    </>
  );
}