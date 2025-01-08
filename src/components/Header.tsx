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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-3 flex justify-between items-center border-b border-gray-200">
      <div className="flex-1" />
      <div className="flex-[2] flex justify-start pl-8">
        <img 
          src="/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png" 
          alt="Agrometric Logo" 
          className="h-8 max-w-[200px] object-contain"
        />
      </div>
      <div className="flex-1 flex justify-end items-center gap-4 pr-4">
        {userName && !isMobile && (
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
    </header>
  );
}