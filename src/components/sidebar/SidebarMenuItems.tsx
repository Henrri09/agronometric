import { Link } from "react-router-dom";
import { 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link 
              to={item.path} 
              className="sidebar-menu-item flex items-center gap-3 px-4 py-2.5 rounded-md w-full"
              onClick={() => isMobile && setOpenMobile(false)}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}