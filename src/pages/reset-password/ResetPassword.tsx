import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/supabase-js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Por favor, insira seu email");
      return;
    }

    try {
      setLoading(true);
      // Armazenar o email no localStorage para usar na página de reset
      localStorage.setItem('reset_password_email', email);

      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      toast.success("Email de redefinição de senha enviado com sucesso!");
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error sending reset email:", authError);
      toast.error(authError.message || "Erro ao enviar email de redefinição de senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-gradient">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h1>
          <p className="text-gray-600">Digite seu email para receber um link de redefinição</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Enviando..." : "Enviar Link de Redefinição"}
          </Button>

          <p className="text-center text-sm text-gray-600">
            Lembrou sua senha?{" "}
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