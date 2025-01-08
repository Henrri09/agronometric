import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { AboutSystem } from "@/components/documentation/AboutSystem";
import { GlossaryItem } from "@/components/documentation/GlossaryItem";
import { SystemGuides } from "@/components/documentation/SystemGuides";
import { BugReportDialog } from "@/components/documentation/BugReportDialog";
import { glossaryItems } from "@/data/glossaryItems";

const Documentation = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const systemGuides = [
    {
      title: "Criação de Ordem de Serviço",
      content: "Para criar uma nova ordem de serviço, siga os passos:\n\n" +
        "1. Acesse o menu 'Ordem de Serviço'\n" +
        "2. Clique no botão 'Nova Ordem'\n" +
        "3. Preencha as informações obrigatórias:\n" +
        "   - Título da ordem\n" +
        "   - Descrição detalhada\n" +
        "   - Tipo de serviço\n" +
        "   - Prioridade\n" +
        "4. Adicione fotos ou documentos se necessário\n" +
        "5. Selecione o responsável pela execução\n" +
        "6. Defina as datas previstas\n" +
        "7. Clique em 'Salvar' para criar a ordem"
    },
    {
      title: "Gestão de Maquinários",
      content: "O cadastro e controle de maquinários é realizado através do menu 'Cadastro Maquinários'. O processo inclui:\n\n" +
        "1. Registro de informações básicas:\n" +
        "   - Nome/identificação do equipamento\n" +
        "   - Modelo e número de série\n" +
        "   - Data de aquisição\n" +
        "   - Localização\n" +
        "2. Configuração de manutenções preventivas\n" +
        "3. Histórico de manutenções realizadas\n" +
        "4. Documentação técnica associada"
    },
    {
      title: "Acompanhamento de Tarefas",
      content: "O sistema oferece um quadro Kanban para gestão visual das atividades:\n\n" +
        "1. Visualização por status:\n" +
        "   - A Fazer\n" +
        "   - Em Andamento\n" +
        "   - Concluído\n" +
        "2. Priorização de atividades\n" +
        "3. Atribuição de responsáveis\n" +
        "4. Acompanhamento de prazos\n" +
        "5. Filtros e busca de tarefas"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Documentação do Sistema</h1>

      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => setIsReportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Bug className="h-4 w-4" />
          Reportar Bug
        </Button>
      </div>

      <AboutSystem />

      <Card>
        <CardHeader>
          <CardTitle>Glossário</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {glossaryItems.map((item, index) => (
              <GlossaryItem
                key={index}
                term={item.term}
                definition={item.definition}
                details={item.details}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <SystemGuides guides={systemGuides} />

      <BugReportDialog 
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
      />
    </div>
  );
};

export default Documentation;