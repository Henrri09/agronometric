import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { MenuItemType } from "./types";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarDesktopProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarDesktop({ isSuperAdmin, menuItems, superAdminItems }: SidebarDesktopProps) {
  const { open } = useSidebar();
  
  return (
    <div className="fixed top-0 left-0 h-full bg-background border-r z-40 hidden md:block transition-all duration-300" 
         style={{ width: open ? '280px' : '64px' }}>
      <Sidebar className="!bg-background pt-16">
        <div className="absolute right-[-12px] top-20">
          <SidebarTrigger />
        </div>
        <SidebarContent>
          {!isSuperAdmin && (
            <SidebarGroup>
              <div className="px-4">
                <SidebarGroupLabel className="text-sm font-medium">Menu Principal</SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={menuItems} isCollapsed={!open} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {isSuperAdmin && (
            <SidebarGroup>
              <div className="px-4">
                <SidebarGroupLabel className="text-sm font-medium">Super Admin</SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={superAdminItems} isCollapsed={!open} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}