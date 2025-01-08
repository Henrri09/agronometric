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
        <Button variant="link" className="text-primary hover:text-primary/80">
          <MessageSquareMore className="mr-2 h-4 w-4" />
          Problemas de acesso? - Fale conosco
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Suporte AgroMetric</DrawerTitle>
          </DrawerHeader>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Seu email para contato
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Como podemos ajudar?
              </label>
              <Textarea
                id="message"
                placeholder="Descreva seu problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar mensagem
            </Button>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}