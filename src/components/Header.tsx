import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
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