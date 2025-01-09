import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { MenuItemType } from "./types";
import { PanelLeftClose, PanelRightClose } from "lucide-react";

interface SidebarDesktopProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarDesktop({ isSuperAdmin, menuItems, superAdminItems }: SidebarDesktopProps) {
  const { open } = useSidebar();

  return (
    <div className="fixed top-0 left-0 h-screen bg-background border-r z-40 hidden md:block">
      <Sidebar className="!bg-background">
        <div className="absolute right-[-12px] top-4 z-50">
          <SidebarTrigger>
            {open ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelRightClose className="h-5 w-5" />
            )}
          </SidebarTrigger>
        </div>
        <SidebarContent>
          {!isSuperAdmin && (
            <SidebarGroup>
              <div className="px-4">
                <SidebarGroupLabel className="text-sm font-medium">Menu Principal</SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={menuItems} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {isSuperAdmin && (
            <SidebarGroup>
              <div className="px-4">
                <SidebarGroupLabel className="text-sm font-medium">Super Admin</SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={superAdminItems} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}