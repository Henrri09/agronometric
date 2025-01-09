import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { MenuItemType } from "./types";
import { Button } from "../ui/button";

interface SidebarDesktopProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarDesktop({ isSuperAdmin, menuItems, superAdminItems }: SidebarDesktopProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="fixed top-0 left-0 h-screen bg-background border-r z-40 hidden md:block">
      <Sidebar 
        className={`!bg-background transition-all duration-300 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}
        data-state={state}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border bg-background shadow-md"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
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