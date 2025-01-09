import { useIsMobile } from "@/hooks/use-mobile";
import { useUserRole } from "@/hooks/use-user-role";
import { SidebarMobile } from "./sidebar/SidebarMobile";
import { SidebarDesktop } from "./sidebar/SidebarDesktop";
import { menuItems, superAdminItems } from "./sidebar/menu-items";

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
    <>
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
    </>
  );
}