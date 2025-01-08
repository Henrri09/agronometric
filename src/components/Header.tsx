import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    <header className="fixed top-0 left-0 right-0 h-12 bg-background border-b z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">AgroMetric</span>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Sair
        </Button>
      </div>
    </header>
  );
}