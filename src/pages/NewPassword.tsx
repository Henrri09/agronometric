import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/supabase-js";

export default function NewPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(localStorage.getItem('reset_password_email') || "");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            toast.error("Link inválido ou expirado");
            navigate("/request-reset");
        } else {
            setShowForm(true);
        }
    }, [searchParams, navigate]);

    const validatePassword = (password: string) => {
        if (password.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres";
        }
        if (!/[A-Z]/.test(password)) {
            return "A senha deve conter pelo menos uma letra maiúscula";
        }
        if (!/[0-9]/.test(password)) {
            return "A senha deve conter pelo menos um número";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Por favor, insira seu email");
            return;
        }

        if (!newPassword || !confirmPassword) {
            toast.error("Por favor, preencha todos os campos");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("As senhas não coincidem");
            return;
        }

        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            toast.error(passwordError);
            return;
        }

        try {
            setLoading(true);
            console.log("Iniciando redefinição de senha...");

            const token = searchParams.get("token");

            if (!token) {
                throw new Error("Token inválido para redefinição de senha");
            }

            // Verificar o token e atualizar a senha
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'recovery'
            });

            if (error) throw error;

            // Se o token for válido, atualizar a senha
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (updateError) throw updateError;

            // Limpar o email do localStorage
            localStorage.removeItem('reset_password_email');

            console.log("Senha atualizada com sucesso!");
            toast.success("Senha atualizada com sucesso! Você já pode fazer login.");
            navigate("/login");
        } catch (error) {
            const authError = error as AuthError;
            console.error("Error resetting password:", authError);

            if (authError.message.includes("expired") || authError.message.includes("invalid")) {
                toast.error("O link expirou ou é inválido. Por favor, solicite um novo link de redefinição de senha.");
            } else {
                toast.error(authError.message || "Erro ao redefinir senha. Por favor, solicite um novo link.");
            }

            navigate("/request-reset");
        } finally {
            setLoading(false);
        }
    };

    if (!showForm) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center auth-gradient">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Senha</h1>
                    <p className="text-gray-600">Digite sua nova senha</p>
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

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                type="password"
                                placeholder="Nova senha"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                                placeholder="Confirme a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="pl-10"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                        {loading ? "Atualizando..." : "Atualizar Senha"}
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