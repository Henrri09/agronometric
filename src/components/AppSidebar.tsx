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
import { Home, Tractor, ClipboardList, Users, BarChart2, Settings, Calendar, Boxes, DollarSign, LineChart, LifeBuoy, BookOpen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (roles?.role === "admin" || roles?.role === "super_admin") {
          setIsAdmin(true);
        }
        setIsSuperAdmin(roles?.role === "super_admin");
      }
    };

    checkAdminStatus();
  }, []);

  const menuItems = [
    { title: "Painel Empresa", icon: Home, path: "/", adminOnly: false },
    { title: "Cadastro Usuário", icon: Users, path: "/users", adminOnly: true },
    { title: "Cadastro Maquinários", icon: Tractor, path: "/machinery", adminOnly: false },
    { title: "Ordem de Serviço", icon: ClipboardList, path: "/service-orders", adminOnly: false },
    { title: "Analytics", icon: BarChart2, path: "/analytics", adminOnly: true },
    { title: "Inventário de peças", icon: Boxes, path: "/parts-inventory", adminOnly: false },
    { title: "Cronograma de manutenção", icon: Calendar, path: "/maintenance-schedule", adminOnly: false },
    { title: "Calendário", icon: Calendar, path: "/calendar", adminOnly: false },
    { title: "Configurações", icon: Settings, path: "/settings", adminOnly: true },
    { title: "Documentação", icon: BookOpen, path: "/documentation", adminOnly: false },
  ];

  const superAdminItems = [
    { title: "Gestão de Empresas", icon: Home, path: "/super-admin" },
    { title: "Gestão Financeira", icon: DollarSign, path: "/super-admin/financial" },
    { title: "Analytics", icon: LineChart, path: "/super-admin/analytics" },
    { title: "Suporte", icon: LifeBuoy, path: "/super-admin/support" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/super-admin") {
      return location.pathname === "/super-admin";
    }
    return location.pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return `flex items-center gap-2 p-2 rounded-md transition-all duration-200 w-full
      ${isActive(path) 
        ? 'bg-[#F2FCE2] text-[#18374C] border border-[#7AE09A] shadow-sm' 
        : 'hover:bg-[#F2FCE2] hover:shadow-sm hover:border hover:border-[#7AE09A]'
      }`;
  };

  // Filtra os itens do menu com base no status de admin
  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

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
            {isSuperAdmin ? (
              <SidebarGroup>
                <div className="pt-6">
                  <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {superAdminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.path} 
                            className={getLinkClassName(item.path)}
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
            ) : (
              <SidebarGroup>
                <div className="pt-6">
                  <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                </div>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filteredMenuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link 
                            to={item.path} 
                            className={getLinkClassName(item.path)}
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
            )}
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Sidebar Sheet */}
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
            <div className="pt-4">
              <SidebarGroupLabel>
                {isSuperAdmin ? "Super Admin" : "Menu Principal"}
              </SidebarGroupLabel>
            </div>
            <SidebarMenu>
              {(isSuperAdmin ? superAdminItems : filteredMenuItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.path} 
                      className={getLinkClassName(item.path)}
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        </div>
      )}
    </>
  );
}