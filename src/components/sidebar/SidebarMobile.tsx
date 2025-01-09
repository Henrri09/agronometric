import { Button } from "@/components/ui/button";
import { Menu, PanelLeftClose } from "lucide-react";
import { SidebarGroupLabel } from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuItemType } from "./types";

interface SidebarMobileProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarMobile({ isSuperAdmin, menuItems, superAdminItems }: SidebarMobileProps) {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setOpenMobile(true)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {openMobile && (
        <div className="fixed inset-0 bg-background z-40">
          <div className="pt-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setOpenMobile(false)}
            >
              <PanelLeftClose className="h-6 w-6" />
            </Button>
            {!isSuperAdmin && (
              <>
                <div className="pt-4">
                  <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
                </div>
                <SidebarMenuItems items={menuItems} isMobile />
              </>
            )}
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