import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServiceOrderRegister() {
  return (
    <div className="p-6">
      <PageHeader
        title="Nova Ordem de Serviço"
        description="Preencha os dados para criar uma nova ordem de serviço"
      />

      <Card className="p-6">
        <form className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input placeholder="Digite o título" />
              </div>
              
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">João Silva</SelectItem>
                    <SelectItem value="user2">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Equipamento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eq1">Esteira Principal</SelectItem>
                    <SelectItem value="eq2">Tombador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de Manutenção</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive">Preventiva</SelectItem>
                    <SelectItem value="corrective">Corretiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Detalhes da Manutenção</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea 
                  placeholder="Descreva os detalhes da manutenção"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data Prevista</Label>
                  <Input type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline">Cancelar</Button>
            <Button>Criar Ordem de Serviço</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}