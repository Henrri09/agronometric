import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Tractor, 
  Users, 
  BarChart2, 
  Settings, 
  Calendar, 
  Boxes, 
  DollarSign, 
  LineChart, 
  LifeBuoy, 
  BookOpen,
  Database
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/use-user-role";
import { SidebarMenuItems } from "./sidebar/SidebarMenuItems";

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { isAdmin, isSuperAdmin, loading } = useUserRole();

  const menuItems = [
    { title: "Painel Empresa", icon: Home, path: "/", adminOnly: false },
    { title: "Cadastro Usuário", icon: Users, path: "/users", adminOnly: true },
    { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery", adminOnly: true },
    { title: "Analytics", icon: BarChart2, path: "/analytics", adminOnly: true },
    { title: "Inventário de peças", icon: Boxes, path: "/parts-inventory", adminOnly: true },
    { title: "Cronograma de manutenção", icon: Calendar, path: "/maintenance-schedule", adminOnly: true },
    { title: "Configurações", icon: Settings, path: "/settings", adminOnly: true },
    { title: "Documentação", icon: BookOpen, path: "/documentation", adminOnly: false },
  ];

  const superAdminItems = [
    { title: "Gestão de Empresas", icon: Database, path: "/super-admin" },
    { title: "Gestão Financeira", icon: DollarSign, path: "/super-admin/financial" },
    { title: "Analytics", icon: LineChart, path: "/super-admin/analytics" },
    { title: "Suporte", icon: LifeBuoy, path: "/super-admin/support" }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.adminOnly) return true;
    return isAdmin || isSuperAdmin;
  });

  if (loading) {
    return (
      <div className="p-4">
        <p>Carregando menu...</p>
      </div>
    );
  }

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
      <div className={`fixed top-0 left-0 h-full bg-background border-r z-40 mt-12 ${isMobile ? 'hidden' : 'block'}`}>
        <Sidebar className="!bg-background">
          <SidebarContent>
            {isSuperAdmin && (
              <SidebarGroup>
                <div className="pt-6">
                  <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
                </div>
                <SidebarGroupContent>
                  <SidebarMenuItems items={superAdminItems} />
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            <SidebarGroup>
              <div className="pt-6">
                <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              </div>
              <SidebarGroupContent>
                <SidebarMenuItems items={filteredMenuItems} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>

      {isMobile && openMobile && (
        <div className="fixed inset-0 bg-background z-40">
          <div className="pt-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            {isSuperAdmin && (
              <>
                <div className="pt-4">
                  <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
                </div>
                <SidebarMenuItems items={superAdminItems} isMobile />
              </>
            )}
            <div className="pt-4">
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            </div>
            <SidebarMenuItems items={filteredMenuItems} isMobile />
          </div>
        </div>
      )}
    </>
  );
}
