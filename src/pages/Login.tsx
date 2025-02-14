import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LogIn, Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SupportChat } from "@/components/SupportChat";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.status) {
        case 400:
          return "Email ou senha inválidos. Por favor, verifique suas credenciais.";
        case 422:
          return "Formato de email inválido.";
        default:
          return "Erro ao realizar login. Por favor, tente novamente.";
      }
    }
    return error.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      console.log("Iniciando login...");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        console.error("Erro no login:", error);
        toast.error(getErrorMessage(error));
        return;
      }

      if (data.user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        console.log("Login realizado com sucesso!");
        toast.success("Login realizado com sucesso!");

        if (roleData?.role === 'super_admin') {
          navigate("/super-admin");
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Erro inesperado no login:", error);
      toast.error("Erro ao realizar login. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Por favor, insira seu email para redefinir a senha");
      return;
    }

    try {
      setLoading(true);
      console.log("Enviando email de redefinição de senha...");

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error("Erro ao enviar email de redefinição:", error);
        toast.error("Erro ao enviar email de redefinição de senha");
        return;
      }

      setResetEmailSent(true);
      console.log("Email de redefinição enviado com sucesso!");
      toast.success("Email de redefinição de senha enviado!");
    } catch (error: any) {
      console.error("Error sending reset password email:", error);
      toast.error("Erro ao enviar email de redefinição de senha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-gradient">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-accent mb-2">AgroMetric</h1>
          <p className="text-accent/70">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-primary/60" />
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
              <Lock className="absolute left-3 top-3 h-5 w-5 text-primary/60" />
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

          <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" size="lg" disabled={loading}>
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center w-full">
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-sm text-primary hover:text-primary-hover hover:underline"
                disabled={loading}
              >
                Esqueceu sua senha?
              </button>

              {resetEmailSent && (
                <p className="text-sm text-green-600">
                  Email de redefinição enviado! Verifique sua caixa de entrada.
                </p>
              )}
            </div>

            <SupportChat />
          </div>
        </form>
      </div>
    </div>
  );
}