import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarContent } from "./sidebar/SidebarContent";

export function AppSidebar() {
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(roles?.role === "admin");
        setIsSuperAdmin(roles?.role === "super_admin");
      }
    };

    checkAdminStatus();
  }, []);

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      <div className={`fixed top-0 left-0 h-full bg-background border-r z-40 mt-12 ${isMobile ? 'hidden' : 'block'}`}>
        <Sidebar className="!bg-background">
          <SidebarContent 
            isAdmin={isAdmin}
            isSuperAdmin={isSuperAdmin}
            isMobile={isMobile}
            setOpenMobile={setOpenMobile}
          />
        </Sidebar>
      </div>

      {isMobile && openMobile && (
        <div className="fixed inset-0 bg-background z-40">
          <div className="pt-16 px-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <SidebarContent 
              isAdmin={isAdmin}
              isSuperAdmin={isSuperAdmin}
              isMobile={isMobile}
              setOpenMobile={setOpenMobile}
            />
          </div>
        </div>
      )}
    </>
  );
}