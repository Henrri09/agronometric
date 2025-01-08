import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Documentation = () => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    screenshot: null as File | null
  });

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
        "- Recursos necessários (materiais, ferramentas, pessoal)"
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
        "- Minimiza paradas não programadas"
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
        "- Análise de causa raiz para prevenção futura"
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
        "- Gestão de prioridades"
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
        "- Custos e valores unitários"
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

  const handleBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      let screenshotUrl = null;

      if (bugReport.screenshot) {
        const fileExt = bugReport.screenshot.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bug_screenshots')
          .upload(fileName, bugReport.screenshot);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('bug_screenshots')
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
      }

      const { error } = await supabase
        .from('bug_reports')
        .insert({
          title: bugReport.title,
          description: bugReport.description,
          screenshot_url: screenshotUrl,
          reporter_id: user?.id,
          company_id: profile?.company_id
        });

      if (error) throw error;

      toast.success("Bug reportado com sucesso!");
      setIsReportDialogOpen(false);
      setBugReport({ title: "", description: "", screenshot: null });
    } catch (error: any) {
      toast.error("Erro ao reportar bug: " + error.message);
    }
  };

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

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este sistema foi desenvolvido para gerenciar e controlar as atividades de manutenção
            de maquinários, permitindo o acompanhamento de ordens de serviço, gestão de inventário
            de peças e planejamento de manutenções preventivas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Glossário</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {glossaryItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.term}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>{item.definition}</p>
                  {item.details && (
                    <ul className="list-none space-y-2">
                      {item.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                  {item.image && (
                    <div className="mt-4">
                      <img 
                        src={item.image} 
                        alt={item.term}
                        className="rounded-lg max-w-full h-auto"
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Guias do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {systemGuides.map((guide, index) => (
              <AccordionItem key={index} value={`guide-${index}`}>
                <AccordionTrigger className="text-left">
                  {guide.title}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="whitespace-pre-line">{guide.content}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reportar Bug</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBugReport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={bugReport.title}
                onChange={(e) => setBugReport(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Descreva o problema brevemente"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea
                id="description"
                value={bugReport.description}
                onChange={(e) => setBugReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descreva o problema em detalhes"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshot">Screenshot (opcional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBugReport(prev => ({ 
                    ...prev, 
                    screenshot: e.target.files ? e.target.files[0] : null 
                  }))}
                />
                <Image className="h-4 w-4" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enviar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documentation;