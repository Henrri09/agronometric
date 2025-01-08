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
  Database, 
  DollarSign, 
  LineChart, 
  LifeBuoy
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/use-user-role";
import { SidebarMenuItems } from "./sidebar/SidebarMenuItems";

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const { isAdmin, isSuperAdmin, loading } = useUserRole();

  const superAdminItems = [
    { title: "Gestão de Empresas", icon: Database, path: "/super-admin" },
    { title: "Gestão Financeira", icon: DollarSign, path: "/super-admin/financial" },
    { title: "Analytics", icon: LineChart, path: "/super-admin/analytics" },
    { title: "Suporte", icon: LifeBuoy, path: "/super-admin/support" }
  ];

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
          </div>
        </div>
      )}
    </>
  );
}