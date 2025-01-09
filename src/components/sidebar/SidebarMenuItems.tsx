import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { MenuItemType } from "./types";

interface SidebarMenuItemsProps {
  items: MenuItemType[];
  isMobile?: boolean;
  isCollapsed?: boolean;
}

export function SidebarMenuItems({ items, isMobile, isCollapsed }: SidebarMenuItemsProps) {
  const { setOpenMobile } = useSidebar();

  const MenuItem = ({ item }: { item: MenuItemType }) => {
    const content = (
      <Link 
        to={item.path} 
        className="sidebar-menu-item flex items-center gap-3 px-4 py-2.5 rounded-md w-full"
        onClick={() => isMobile && setOpenMobile(false)}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        {!isCollapsed && <span className="text-sm truncate">{item.title}</span>}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {content}
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <MenuItem item={item} />
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}