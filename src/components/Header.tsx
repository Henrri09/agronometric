import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
    <header className="bg-white border-b border-gray-200 h-14">
      {isMobile ? (
        <div className="grid grid-cols-[48px_1fr_48px] items-center h-full px-4">
          <div className="flex justify-start">
            <div className="w-10 h-10" />
          </div>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png" 
              alt="Agrometric Logo" 
              className="h-6 max-w-[160px] object-contain"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hover:bg-gray-100 w-8 h-8"
            >
              <LogOut className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png" 
              alt="Agrometric Logo" 
              className="h-6 max-w-[160px] object-contain"
            />
          </div>
          <div className="flex justify-end items-center gap-4">
            {userName && (
              <span className="text-gray-700 text-sm">
                {`Olá ${userName}, seja bem-vindo`}
              </span>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="hover:bg-gray-100 w-8 h-8"
            >
              <LogOut className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}