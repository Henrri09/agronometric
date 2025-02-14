import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { AuthError } from "@supabase/supabase-js";

export default function SetInitialPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Configurar a sessão com os tokens do hash da URL
        const setupSession = async () => {
            const params = new URLSearchParams(location.hash.substring(1));
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            if (!accessToken) {
                toast.error("Link inválido ou expirado");
                navigate("/login");
                return;
            }

            try {
                const { error: sessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken || "",
                });

                if (sessionError) throw sessionError;
            } catch (error) {
                console.error("Error setting session:", error);
                toast.error("Erro ao configurar sessão. Por favor, tente novamente.");
                navigate("/login");
            }
        };

        setupSession();
    }, [navigate, location]);

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
            console.log("Iniciando configuração de senha...");

            // Atualizar a senha
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            console.log("Senha configurada com sucesso!");
            toast.success("Senha configurada com sucesso! Você já pode fazer login.");

            // Fazer logout para forçar um novo login com a nova senha
            await supabase.auth.signOut();
            navigate("/login");
        } catch (error) {
            const authError = error as AuthError;
            console.error("Error setting password:", authError);
            toast.error(authError.message || "Erro ao configurar senha. Por favor, entre em contato com o suporte.");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center auth-gradient">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Configure sua Senha</h1>
                    <p className="text-gray-600">Defina uma senha para acessar sua conta</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                        {loading ? "Configurando..." : "Configurar Senha"}
                    </Button>

                    <p className="text-center text-sm text-gray-600">
                        Já tem uma senha?{" "}
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