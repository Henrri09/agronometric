import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import { AboutSystem } from "@/components/documentation/AboutSystem";
import { GlossaryItem } from "@/components/documentation/GlossaryItem";
import { SystemGuides } from "@/components/documentation/SystemGuides";
import { BugReportDialog } from "@/components/documentation/BugReportDialog";

const Documentation = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const glossaryItems = [
    {
      term: "Ordem de Serviço",
      definition: "Documento oficial que registra e autoriza a execução de serviços de manutenção. Inclui informações detalhadas como:",
      details: [
        "- Identificação única do serviço",
        "- Descrição detalhada do problema ou serviço necessário",
        "- Prioridade (Baixa, Média, Alta, Urgente)",
        "- Status atual (Pendente, Em Andamento, Concluído)",
        "- Responsável pela execução",
        "- Datas previstas de início e conclusão",
        "- Recursos necessários (materiais, ferramentas, pessoal)",
        "- Histórico de atualizações e comentários",
        "- Fotos e documentação anexada",
        "- Custos associados e orçamento"
      ],
      image: "/lovable-uploads/86211256-d922-4329-9985-48f0539a6443.png"
    },
    {
      term: "Manutenção Preventiva",
      definition: "Conjunto de procedimentos planejados que visam prevenir falhas e prolongar a vida útil dos equipamentos. Características principais:",
      details: [
        "- Realizada em intervalos regulares predefinidos",
        "- Baseada em horas de operação ou tempo calendário",
        "- Inclui inspeções, limpezas, lubrificações e ajustes",
        "- Reduz custos com reparos emergenciais",
        "- Aumenta a confiabilidade dos equipamentos",
        "- Minimiza paradas não programadas",
        "- Otimiza recursos e planejamento",
        "- Inclui checklist de verificação",
        "- Gera relatórios de acompanhamento",
        "- Permite análise de tendências"
      ],
      image: "/lovable-uploads/5c1d0c82-91bb-4749-b5fb-5a6b7bcdc237.png"
    },
    {
      term: "Manutenção Corretiva",
      definition: "Ação realizada após a ocorrência de uma falha para restaurar o funcionamento do equipamento. Aspectos importantes:",
      details: [
        "- Realizada quando há quebra ou falha do equipamento",
        "- Pode ser planejada ou emergencial",
        "- Requer diagnóstico preciso do problema",
        "- Pode envolver substituição de peças",
        "- Documentação detalhada do reparo realizado",
        "- Análise de causa raiz para prevenção futura",
        "- Impacto na produção e custos",
        "- Priorização baseada na criticidade",
        "- Histórico de intervenções anteriores",
        "- Recomendações para evitar reincidência"
      ],
      image: "/lovable-uploads/2184b402-1719-4108-83fc-c6daff6b9a14.png"
    },
    {
      term: "Cronograma de Manutenção",
      definition: "Planejamento temporal detalhado das atividades de manutenção, incluindo:",
      details: [
        "- Calendário de manutenções preventivas",
        "- Programação de inspeções periódicas",
        "- Agendamento de calibrações",
        "- Previsão de paradas programadas",
        "- Distribuição de recursos e pessoal",
        "- Gestão de prioridades",
        "- Alinhamento com produção",
        "- Janelas de manutenção",
        "- Roteiros de execução",
        "- Indicadores de cumprimento"
      ]
    },
    {
      term: "Inventário de Peças",
      definition: "Sistema de controle e gestão do estoque de peças e componentes, contemplando:",
      details: [
        "- Cadastro de itens com códigos únicos",
        "- Controle de quantidade mínima e máxima",
        "- Histórico de movimentações",
        "- Rastreabilidade de peças",
        "- Gestão de fornecedores",
        "- Custos e valores unitários",
        "- Localização no almoxarifado",
        "- Vida útil e garantias",
        "- Compatibilidade com equipamentos",
        "- Alertas de reposição"
      ]
    },
    {
      term: "Gestão de Ativos",
      definition: "Processo sistemático de gerenciamento dos equipamentos e recursos da empresa:",
      details: [
        "- Registro completo dos equipamentos",
        "- Histórico de manutenções",
        "- Análise de desempenho",
        "- Custos operacionais",
        "- Ciclo de vida dos ativos",
        "- Depreciação e substituição",
        "- Documentação técnica",
        "- Certificações e licenças",
        "- Indicadores de eficiência",
        "- Planejamento de investimentos"
      ]
    }
  ];

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
                image={item.image}
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