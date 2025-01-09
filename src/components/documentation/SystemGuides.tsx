import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SystemGuides() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Guias do Sistema</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="criar-os">
          <AccordionTrigger>Criação de Ordem de Serviço</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              Para criar uma nova Ordem de Serviço (OS), siga o passo a passo abaixo. É **importante preencher todos os campos 
              obrigatórios** para garantir um registro completo e eficiente do serviço.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "**Ordens de Serviço**" na barra lateral</li>
              <li>Clique no botão "**Nova Ordem de Serviço**" no topo da página</li>
              <li>No formulário, preencha os campos obrigatórios:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>**Título**: Breve descrição do serviço</li>
                  <li>**Descrição detalhada**: Explique o problema ou serviço necessário</li>
                  <li>**Tipo de serviço**: Preventiva, Corretiva, etc.</li>
                  <li>**Prioridade**: Baixa, Média, Alta ou Urgente</li>
                </ul>
              </li>
              <li>Selecione o **equipamento relacionado** na lista disponível</li>
              <li>Escolha o **responsável** pela execução do serviço</li>
              <li>Defina as **datas previstas**:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Data de início</li>
                  <li>Prazo de conclusão</li>
                  <li>Horários previstos</li>
                </ul>
              </li>
              <li>**Anexe fotos ou documentos** relevantes (opcional mas recomendado)</li>
              <li>Revise todas as informações e clique em "**Salvar**"</li>
            </ol>
            <p className="mt-4">
              **Dica importante**: Quanto mais detalhada for a descrição e documentação, mais fácil será para a equipe 
              de manutenção executar o serviço corretamente.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gestao-maquinarios">
          <AccordionTrigger>Gestão de Maquinários</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              O módulo de Gestão de Maquinários permite um **controle completo** de todos os equipamentos da sua empresa. 
              Aqui está como utilizar suas principais funcionalidades:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "**Maquinários**" na barra lateral</li>
              <li>Para adicionar um novo equipamento:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Clique em "**Novo Maquinário**"</li>
                  <li>Preencha as informações básicas: nome, modelo, número de série</li>
                  <li>Adicione especificações técnicas importantes</li>
                  <li>Inclua fotos do equipamento se disponíveis</li>
                </ul>
              </li>
              <li>Defina o **status atual** do equipamento:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Em operação</li>
                  <li>Em manutenção</li>
                  <li>Inativo</li>
                  <li>Aguardando peças</li>
                </ul>
              </li>
              <li>Para equipamentos existentes:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Use o botão de edição para atualizar informações</li>
                  <li>Visualize o histórico completo de manutenções</li>
                  <li>Acompanhe indicadores de desempenho</li>
                </ul>
              </li>
              <li>**Acompanhe métricas importantes**:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tempo médio entre falhas</li>
                  <li>Custos de manutenção</li>
                  <li>Disponibilidade do equipamento</li>
                  <li>Histórico de intervenções</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4">
              **Lembre-se**: Manter as informações dos equipamentos sempre atualizadas é fundamental para uma gestão 
              eficiente da manutenção.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="acompanhamento-tarefas">
          <AccordionTrigger>Acompanhamento de Tarefas</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              O sistema oferece uma **visualização clara e intuitiva** de todas as tarefas em andamento através de um 
              quadro Kanban. Veja como utilizar:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "**Tarefas**" na barra lateral</li>
              <li>No quadro Kanban, você encontrará as colunas:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>**A Fazer**: Tarefas que ainda não foram iniciadas</li>
                  <li>**Em Andamento**: Tarefas que estão sendo executadas</li>
                  <li>**Em Revisão**: Tarefas aguardando verificação</li>
                  <li>**Concluído**: Tarefas finalizadas</li>
                </ul>
              </li>
              <li>Para gerenciar as tarefas:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>**Arraste e solte** os cards entre as colunas para atualizar status</li>
                  <li>Clique em um card para ver **todos os detalhes**</li>
                  <li>Adicione **comentários e atualizações** nas tarefas</li>
                </ul>
              </li>
              <li>Use os **filtros disponíveis** para visualizar:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tarefas por responsável</li>
                  <li>Tarefas por prioridade</li>
                  <li>Tarefas por equipamento</li>
                  <li>Tarefas atrasadas</li>
                </ul>
              </li>
              <li>**Acompanhamento em tempo real**:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Receba notificações de atualizações importantes</li>
                  <li>Visualize prazos e progresso</li>
                  <li>Identifique gargalos no processo</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4">
              **Dica de produtividade**: Mantenha o quadro sempre atualizado para ter uma visão clara do andamento 
              de todas as atividades de manutenção.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}