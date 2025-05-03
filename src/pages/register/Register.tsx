import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data) {
        toast.success("Registro realizado com sucesso! Verifique seu email.");
        navigate("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/90 to-accent/90">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AgroMetric</h1>
          <p className="text-gray-600">Crie sua conta para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Nome completo"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Registrando..." : "Registrar"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-primary hover:underline"
              disabled={loading}
            >
              Faça login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}