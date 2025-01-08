import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquareMore } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SupportChat() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensagem enviada com sucesso! Em breve entraremos em contato.");
    setMessage("");
    setEmail("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          className="bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary/90 font-medium rounded-full transition-all duration-300 transform hover:scale-105"
        >
          <MessageSquareMore className="mr-2 h-5 w-5" />
          Problemas de acesso? - Fale conosco
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh] bg-gradient-to-b from-white to-secondary/10">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-bold text-primary">
              Suporte AgroMetric
            </DrawerTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Estamos aqui para ajudar! Preencha o formulário abaixo e entraremos em contato.
            </p>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">
                Seu email para contato
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-primary/20 focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-primary">
                Como podemos ajudar?
              </label>
              <Textarea
                id="message"
                placeholder="Descreva seu problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px] border-primary/20 focus:border-primary transition-colors resize-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-6 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <MessageSquareMore className="mr-2 h-5 w-5" />
              Enviar mensagem
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}