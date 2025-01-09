import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { SidebarMenuItems } from "./SidebarMenuItems";
import { MenuItemType } from "./types";
import { Button } from "@/components/ui/button";

interface SidebarDesktopProps {
  isSuperAdmin: boolean;
  menuItems: MenuItemType[];
  superAdminItems: MenuItemType[];
}

export function SidebarDesktop({ isSuperAdmin, menuItems, superAdminItems }: SidebarDesktopProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-background border-r z-40 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <Sidebar className="!bg-background h-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-4 z-50"
          onClick={() => setIsCollapsed(!isCollapsed)}
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
                <SidebarGroupLabel className={`text-sm font-medium ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                  Menu Principal
                </SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={menuItems} isCollapsed={isCollapsed} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {isSuperAdmin && (
            <SidebarGroup>
              <div className="px-4">
                <SidebarGroupLabel className={`text-sm font-medium ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
                  Super Admin
                </SidebarGroupLabel>
              </div>
              <SidebarGroupContent className="mt-2">
                <SidebarMenuItems items={superAdminItems} isCollapsed={isCollapsed} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </div>
  );
}