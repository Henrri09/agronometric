import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/use-user-role";
import { SidebarMobile } from "./sidebar/SidebarMobile";
import { SidebarDesktop } from "./sidebar/SidebarDesktop";
import { menuItems, superAdminItems } from "./sidebar/menu-items";
import { SidebarProvider } from "./ui/sidebar";

export function AppSidebar() {
  const isMobile = useIsMobile();
  const { isSuperAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="p-4">
        <p>Carregando menu...</p>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {isMobile ? (
        <SidebarMobile
          isSuperAdmin={isSuperAdmin}
          menuItems={menuItems}
          superAdminItems={superAdminItems}
        />
      ) : (
        <SidebarDesktop
          isSuperAdmin={isSuperAdmin}
          menuItems={menuItems}
          superAdminItems={superAdminItems}
        />
      )}
    </SidebarProvider>
  );
}