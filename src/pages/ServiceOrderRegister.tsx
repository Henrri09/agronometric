import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ServiceOrderRegister() {
  return (
    <div className="p-6">
      <PageHeader
        title="Registrar Ordem de Serviço"
        description="Crie uma nova ordem de serviço no sistema"
      />
      
      <Card>
        <CardContent className="p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipamento</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esteira">Esteira Industrial X1000</SelectItem>
                  <SelectItem value="empacotadora">Empacotadora AutoPack</SelectItem>
                  <SelectItem value="misturador">Misturador Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Manutenção</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventiva">Preventiva</SelectItem>
                  <SelectItem value="corretiva">Corretiva</SelectItem>
                  <SelectItem value="preditiva">Preditiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data Limite</Label>
              <Input type="date" id="dueDate" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <textarea 
                className="w-full min-h-[100px] p-2 border rounded-md" 
                id="description" 
                placeholder="Descreva o serviço a ser realizado..."
              />
            </div>
            
            <Button type="submit" className="w-full">
              Registrar Ordem de Serviço
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}