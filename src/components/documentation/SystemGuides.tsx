import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SystemGuides() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Guias do Sistema</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="criar-os">
          <AccordionTrigger>Criação de Ordem de Serviço</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "Ordens de Serviço"</li>
              <li>Clique no botão "Nova Ordem de Serviço"</li>
              <li>Preencha os campos obrigatórios: título, descrição, tipo de serviço e prioridade</li>
              <li>Selecione o equipamento relacionado</li>
              <li>Atribua um responsável pela execução</li>
              <li>Defina prazos e datas previstas</li>
              <li>Anexe fotos ou documentos relevantes</li>
              <li>Clique em "Salvar" para criar a ordem de serviço</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gestao-maquinarios">
          <AccordionTrigger>Gestão de Maquinários</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "Maquinários"</li>
              <li>Para adicionar novo equipamento, clique em "Novo Maquinário"</li>
              <li>Preencha as informações do equipamento: nome, modelo, número de série</li>
              <li>Defina o status do equipamento</li>
              <li>Para editar um equipamento existente, clique no botão de edição</li>
              <li>Para visualizar o histórico de manutenções, clique no equipamento</li>
              <li>Acompanhe indicadores de desempenho e custos de manutenção</li>
              <li>Gerencie a programação de manutenções preventivas</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="acompanhamento-tarefas">
          <AccordionTrigger>Acompanhamento de Tarefas</AccordionTrigger>
          <AccordionContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "Tarefas"</li>
              <li>Visualize todas as tarefas no quadro Kanban</li>
              <li>Arraste e solte tarefas entre as colunas para atualizar status</li>
              <li>Clique em uma tarefa para ver detalhes</li>
              <li>Adicione comentários e atualizações nas tarefas</li>
              <li>Filtre tarefas por responsável ou prioridade</li>
              <li>Acompanhe prazos e progresso das atividades</li>
              <li>Receba notificações de atualizações importantes</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}