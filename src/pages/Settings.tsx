import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="p-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre ordens de serviço
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas do Sistema</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações sobre manutenções preventivas
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input id="companyName" placeholder="Digite o nome da empresa" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email de Contato</Label>
                <Input id="email" type="email" placeholder="Digite o email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" placeholder="Digite o telefone" />
              </div>
              
              <Button type="submit">Salvar Alterações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}