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
  Database,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No session found");
          setLoading(false);
          return;
        }

        console.log("Checking roles for user:", session.user.id);
        
        const { data: userRole, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching user role:", error);
          toast.error("Erro ao carregar permissões do usuário");
          return;
        }

        console.log("User role response:", userRole);
        
        if (userRole?.role) {
          setIsAdmin(userRole.role === 'admin');
          setIsSuperAdmin(userRole.role === 'super_admin');
          console.log("Role set - Admin:", userRole.role === 'admin', "SuperAdmin:", userRole.role === 'super_admin');
        } else {
          console.log("No role found for user");
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } catch (error) {
        console.error("Error in checkUserRole:", error);
        toast.error("Erro ao verificar status do usuário");
      } finally {
        setLoading(false);
      }
    };

    // Verificar role inicial
    checkUserRole();

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    { title: "Suporte", icon: LifeBuoy, path: "/super-admin/support" },
    { title: "Esportes", icon: Trophy, path: "/super-admin/sports" }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.adminOnly) return true;
    return isAdmin || isSuperAdmin;
  });

  const renderMenu = (items: typeof menuItems | typeof superAdminItems) => (
    <SidebarMenu>
      {items.map((item) => (
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
  );

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
                  {renderMenu(superAdminItems)}
                </SidebarGroupContent>
              </SidebarGroup>
            )}
            <SidebarGroup>
              <div className="pt-6">
                <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              </div>
              <SidebarGroupContent>
                {renderMenu(filteredMenuItems)}
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
                {renderMenu(superAdminItems)}
              </>
            )}
            <div className="pt-4">
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            </div>
            {renderMenu(filteredMenuItems)}
          </div>
        </div>
      )}
    </>
  );
}