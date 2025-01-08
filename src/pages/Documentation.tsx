import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Documentation = () => {
  const glossaryItems = [
    {
      term: "Ordem de Serviço",
      definition: "Documento que registra uma solicitação de manutenção ou reparo em um equipamento, contendo informações como descrição do problema, prioridade e responsável."
    },
    {
      term: "Manutenção Preventiva",
      definition: "Tipo de manutenção programada realizada periodicamente para prevenir falhas e prolongar a vida útil do equipamento."
    },
    {
      term: "Manutenção Corretiva",
      definition: "Manutenção realizada após a ocorrência de uma falha, com objetivo de restaurar o funcionamento do equipamento."
    },
    {
      term: "Cronograma de Manutenção",
      definition: "Planejamento temporal das atividades de manutenção preventiva dos equipamentos."
    },
    {
      term: "Inventário de Peças",
      definition: "Controle do estoque de peças e componentes disponíveis para manutenção."
    }
  ];

  const systemGuides = [
    {
      title: "Criação de Ordem de Serviço",
      content: "Para criar uma nova ordem de serviço, acesse o menu 'Ordem de Serviço' e clique no botão 'Nova Ordem'. Preencha as informações necessárias como título, descrição, tipo de serviço e prioridade."
    },
    {
      title: "Gestão de Maquinários",
      content: "O cadastro e controle de maquinários é realizado através do menu 'Cadastro Maquinários'. Aqui você pode adicionar novos equipamentos, atualizar informações e visualizar o histórico de manutenções."
    },
    {
      title: "Acompanhamento de Tarefas",
      content: "O sistema permite o acompanhamento de tarefas através do quadro Kanban, onde é possível visualizar e gerenciar o status das atividades em andamento."
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Documentação do Sistema</h1>

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
                <AccordionContent>
                  {item.definition}
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
                  {guide.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documentation;