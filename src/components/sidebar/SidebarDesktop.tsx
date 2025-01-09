import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { MenuItemType } from "./types";

interface SidebarDesktopProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarDesktop({ isSuperAdmin, menuItems, superAdminItems }: SidebarDesktopProps) {
  return (
    <div className="fixed top-0 left-0 h-full bg-background border-r z-40 mt-12 hidden md:block">
      <Sidebar className="!bg-background">
        <SidebarContent>
          {!isSuperAdmin && (
            <SidebarGroup>
              <div className="pt-6 md:pt-8">
                <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              </div>
              <SidebarGroupContent>
                <SidebarMenuItems items={menuItems} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {isSuperAdmin && (
            <SidebarGroup>
              <div className="pt-6 md:pt-8">
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
  );
}