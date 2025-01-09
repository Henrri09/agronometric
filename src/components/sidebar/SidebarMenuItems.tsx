import { Link } from "react-router-dom";
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemType {
  title: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarMenuItemsProps {
  items: MenuItemType[];
  isMobile?: boolean;
}

export function SidebarMenuItems({ items, isMobile }: SidebarMenuItemsProps) {
  const { setOpenMobile, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const MenuItem = ({ item }: { item: MenuItemType }) => {
    const menuItem = (
      <SidebarMenuButton asChild>
        <Link 
          to={item.path} 
          className="sidebar-menu-item flex items-center gap-3 px-4 py-2.5 rounded-md w-full"
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <item.icon className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm">{item.title}</span>}
        </Link>
      </SidebarMenuButton>
    );

    if (isCollapsed && !isMobile) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {menuItem}
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return menuItem;
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <MenuItem item={item} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}