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
              Para criar uma nova Ordem de Serviço (OS), siga o passo a passo abaixo. É <strong>importante preencher todos os campos 
              obrigatórios</strong> para garantir um registro completo e eficiente do serviço.
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "<strong>Ordens de Serviço</strong>" na barra lateral</li>
              <li>Clique no botão "<strong>Nova Ordem de Serviço</strong>" no topo da página</li>
              <li>No formulário, preencha os campos obrigatórios:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Título</strong>: Breve descrição do serviço</li>
                  <li><strong>Descrição detalhada</strong>: Explique o problema ou serviço necessário</li>
                  <li><strong>Tipo de serviço</strong>: Preventiva, Corretiva, etc.</li>
                  <li><strong>Prioridade</strong>: Baixa, Média, Alta ou Urgente</li>
                </ul>
              </li>
              <li>Selecione o <strong>equipamento relacionado</strong> na lista disponível</li>
              <li>Escolha o <strong>responsável</strong> pela execução do serviço</li>
              <li>Defina as <strong>datas previstas</strong>:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Data de início</li>
                  <li>Prazo de conclusão</li>
                  <li>Horários previstos</li>
                </ul>
              </li>
              <li><strong>Anexe fotos ou documentos</strong> relevantes (opcional mas recomendado)</li>
              <li>Revise todas as informações e clique em "<strong>Salvar</strong>"</li>
            </ol>
            <p className="mt-4">
              <strong>Dica importante</strong>: Quanto mais detalhada for a descrição e documentação, mais fácil será para a equipe 
              de manutenção executar o serviço corretamente.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="gestao-maquinarios">
          <AccordionTrigger>Gestão de Maquinários</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              O módulo de Gestão de Maquinários permite um <strong>controle completo</strong> de todos os equipamentos da sua empresa. 
              Aqui está como utilizar suas principais funcionalidades:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "<strong>Maquinários</strong>" na barra lateral</li>
              <li>Para adicionar um novo equipamento:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Clique em "<strong>Novo Maquinário</strong>"</li>
                  <li>Preencha as informações básicas: nome, modelo, número de série</li>
                  <li>Adicione especificações técnicas importantes</li>
                  <li>Inclua fotos do equipamento se disponíveis</li>
                </ul>
              </li>
              <li>Defina o <strong>status atual</strong> do equipamento:
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
              <li><strong>Acompanhe métricas importantes</strong>:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tempo médio entre falhas</li>
                  <li>Custos de manutenção</li>
                  <li>Disponibilidade do equipamento</li>
                  <li>Histórico de intervenções</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4">
              <strong>Lembre-se</strong>: Manter as informações dos equipamentos sempre atualizadas é fundamental para uma gestão 
              eficiente da manutenção.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="acompanhamento-tarefas">
          <AccordionTrigger>Acompanhamento de Tarefas</AccordionTrigger>
          <AccordionContent>
            <p className="mb-4">
              O sistema oferece uma <strong>visualização clara e intuitiva</strong> de todas as tarefas em andamento através de um 
              quadro Kanban. Veja como utilizar:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Acesse o menu "<strong>Tarefas</strong>" na barra lateral</li>
              <li>No quadro Kanban, você encontrará as colunas:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>A Fazer</strong>: Tarefas que ainda não foram iniciadas</li>
                  <li><strong>Em Andamento</strong>: Tarefas que estão sendo executadas</li>
                  <li><strong>Em Revisão</strong>: Tarefas aguardando verificação</li>
                  <li><strong>Concluído</strong>: Tarefas finalizadas</li>
                </ul>
              </li>
              <li>Para gerenciar as tarefas:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Arraste e solte</strong> os cards entre as colunas para atualizar status</li>
                  <li>Clique em um card para ver <strong>todos os detalhes</strong></li>
                  <li>Adicione <strong>comentários e atualizações</strong> nas tarefas</li>
                </ul>
              </li>
              <li>Use os <strong>filtros disponíveis</strong> para visualizar:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Tarefas por responsável</li>
                  <li>Tarefas por prioridade</li>
                  <li>Tarefas por equipamento</li>
                  <li>Tarefas atrasadas</li>
                </ul>
              </li>
              <li><strong>Acompanhamento em tempo real</strong>:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Receba notificações de atualizações importantes</li>
                  <li>Visualize prazos e progresso</li>
                  <li>Identifique gargalos no processo</li>
                </ul>
              </li>
            </ol>
            <p className="mt-4">
              <strong>Dica de produtividade</strong>: Mantenha o quadro sempre atualizado para ter uma visão clara do andamento 
              de todas as atividades de manutenção.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}