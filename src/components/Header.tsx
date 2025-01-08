import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar logout");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-6 py-3 flex justify-end items-center border-b border-gray-200">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleLogout}
        className="hover:bg-gray-100"
      >
        <LogOut className="h-5 w-5 text-gray-600" />
      </Button>
    </header>
  );
}