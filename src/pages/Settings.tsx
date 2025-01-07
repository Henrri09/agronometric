import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="p-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as configurações do sistema"
      />

      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Configurações Gerais</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Empresa</Label>
                <Input placeholder="Nome da sua empresa" />
              </div>
              <div className="space-y-2">
                <Label>Email principal</Label>
                <Input type="email" placeholder="email@empresa.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Endereço</Label>
              <Input placeholder="Endereço completo" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Notificações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificações por Email</p>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre manutenções por email
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de Manutenção</p>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando uma manutenção estiver próxima
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Segurança</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Senha Atual</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input type="password" />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <Input type="password" />
            </div>
            <Button>Alterar Senha</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}