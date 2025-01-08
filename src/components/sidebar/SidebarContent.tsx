import { Link, useLocation } from "react-router-dom";
import {
  SidebarContent as BaseSidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { menuItems } from "./SidebarMenuItems";
import { superAdminItems } from "./SuperAdminMenuItems";

interface SidebarContentProps {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}

export const SidebarContent = ({ isAdmin, isSuperAdmin, isMobile, setOpenMobile }: SidebarContentProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/super-admin") {
      return location.pathname === "/super-admin";
    }
    return location.pathname === path;
  };

  const getLinkClassName = (path: string) => {
    return `flex items-center gap-2 p-2 rounded-md transition-all duration-200 w-full
      ${isActive(path) 
        ? 'bg-[#F2FCE2] text-[#18374C] border border-[#7AE09A] shadow-sm' 
        : 'hover:bg-[#F2FCE2] hover:shadow-sm hover:border hover:border-[#7AE09A]'
      }`;
  };

  const filteredMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <BaseSidebarContent>
      <div className="p-4">
        {isSuperAdmin ? (
          <SidebarGroup>
            <div className="pt-6">
              <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className={getLinkClassName(item.path)}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          <SidebarGroup>
            <div className="pt-6">
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link 
                        to={item.path} 
                        className={getLinkClassName(item.path)}
                        onClick={() => isMobile && setOpenMobile(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </div>
    </BaseSidebarContent>
  );
};