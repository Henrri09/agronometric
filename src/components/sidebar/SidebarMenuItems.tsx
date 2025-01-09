import { Link } from "react-router-dom";
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface MenuItemType {
  title: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarMenuItemsProps {
  items: MenuItemType[];
  isMobile?: boolean;
  isCollapsed?: boolean;
}

export function SidebarMenuItems({ items, isMobile, isCollapsed }: SidebarMenuItemsProps) {
  const { setOpenMobile } = useSidebar();

  const MenuItem = ({ item }: { item: MenuItemType }) => {
    const menuItem = (
      <Link 
        to={item.path} 
        className="sidebar-menu-item flex items-center gap-3 px-4 py-2.5 rounded-md w-full"
        onClick={() => isMobile && setOpenMobile(false)}
      >
        <item.icon className="h-5 w-5" />
        {!isCollapsed && <span className="text-sm">{item.title}</span>}
      </Link>
    );

    if (isCollapsed && !isMobile) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {menuItem}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.title}
          </TooltipContent>
        </Tooltip>
      );
    }

    return menuItem;
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