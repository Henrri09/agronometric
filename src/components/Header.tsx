import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "./ui/sidebar";

export function Header() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.full_name) {
          setUserName(profile.full_name);
        }
      }
    };

    getUserProfile();
  }, []);

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  return (
    <header 
      className="fixed top-0 right-0 z-40 bg-white h-14 border-b border-gray-200 transition-all duration-300" 
      style={{ 
        left: isMobile ? '0' : isCollapsed ? '80px' : '280px'
      }}
    >
      {isMobile ? (
        <div className="grid grid-cols-[48px_1fr_48px] items-center h-full px-4">
          <div className="flex justify-start">
            <div className="w-10 h-10" />
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png" 
              alt="Agrometric Logo" 
              className="h-8 max-w-[200px] object-contain"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hover:bg-gray-100 w-10 h-10"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png" 
              alt="Agrometric Logo" 
              className="h-8 max-w-[200px] object-contain"
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            {userName && (
              <span className="text-gray-700 font-medium">
                {`Olá ${userName}, seja bem-vindo`}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}