import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function GlossarySection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Glossário</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ordem-servico">
          <AccordionTrigger>Ordem de Serviço</AccordionTrigger>
          <AccordionContent>
            Uma <strong>Ordem de Serviço (OS)</strong> é um documento digital essencial que funciona como um registro detalhado de todas as 
            atividades de manutenção. Ela contém <strong>informações cruciais</strong> como:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Descrição detalhada do problema ou serviço necessário</li>
              <li><strong>Prioridade</strong> do serviço (Baixa, Média, Alta, Urgente)</li>
              <li><strong>Tipo de manutenção</strong> a ser realizada</li>
              <li>Identificação do <strong>equipamento</strong> envolvido</li>
              <li><strong>Responsável</strong> pela execução do serviço</li>
              <li><strong>Prazos</strong> de início e conclusão</li>
              <li>Possibilidade de anexar <strong>fotos e documentos</strong> relevantes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manutencao-preventiva">
          <AccordionTrigger>Manutenção Preventiva</AccordionTrigger>
          <AccordionContent>
            A <strong>Manutenção Preventiva</strong> é um tipo de manutenção <strong>planejada e programada</strong> que visa evitar falhas antes que elas aconteçam. 
            Seus <strong>principais benefícios</strong> incluem:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Redução de paradas não programadas</strong></li>
              <li><strong>Aumento da vida útil</strong> dos equipamentos</li>
              <li><strong>Economia</strong> com reparos de emergência</li>
              <li><strong>Maior segurança</strong> para os operadores</li>
            </ul>
            É realizada em <strong>intervalos regulares</strong>, seguindo um cronograma baseado em:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Recomendações do fabricante</li>
              <li>Horas de operação</li>
              <li>Histórico de desempenho do equipamento</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manutencao-corretiva">
          <AccordionTrigger>Manutenção Corretiva</AccordionTrigger>
          <AccordionContent>
            A <strong>Manutenção Corretiva</strong> é realizada quando ocorre uma <strong>falha ou problema</strong> em um equipamento que precisa 
            ser corrigido imediatamente. Este tipo de manutenção:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>É realizada de forma <strong>não programada</strong></li>
              <li>Visa <strong>restaurar o funcionamento</strong> do equipamento</li>
              <li>Pode ser <strong>emergencial</strong> em casos críticos</li>
              <li>Geralmente tem <strong>custos mais elevados</strong> que a preventiva</li>
            </ul>
            O sistema permite:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Registro detalhado do problema</li>
              <li>Acompanhamento em tempo real do reparo</li>
              <li>Documentação com fotos do antes e depois</li>
              <li>Histórico completo das intervenções realizadas</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cronograma">
          <AccordionTrigger>Cronograma de Manutenção</AccordionTrigger>
          <AccordionContent>
            O <strong>Cronograma de Manutenção</strong> é uma ferramenta de <strong>planejamento essencial</strong> que permite:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Visualização clara</strong> de todas as manutenções programadas</li>
              <li><strong>Organização eficiente</strong> dos recursos e equipes</li>
              <li><strong>Previsão antecipada</strong> de necessidades de peças e materiais</li>
              <li><strong>Redução de conflitos</strong> de agendamento</li>
            </ul>
            Recursos do sistema:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Calendário interativo com visão mensal e semanal</li>
              <li>Código de cores para diferentes tipos de manutenção</li>
              <li>Alertas automáticos de proximidade de manutenções</li>
              <li>Possibilidade de reajuste de datas quando necessário</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="inventario">
          <AccordionTrigger>Inventário de Peças</AccordionTrigger>
          <AccordionContent>
            O <strong>Inventário de Peças</strong> é um módulo do sistema que permite o <strong>controle completo</strong> do estoque de componentes 
            e materiais necessários para manutenção. Principais funcionalidades:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Controle em tempo real</strong> das quantidades disponíveis</li>
              <li><strong>Alertas automáticos</strong> de estoque baixo</li>
              <li><strong>Histórico detalhado</strong> de consumo de peças</li>
              <li><strong>Rastreamento</strong> de custos e gastos com materiais</li>
            </ul>
            O sistema permite:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cadastro detalhado de cada item com código e especificações</li>
              <li>Definição de níveis mínimos de estoque</li>
              <li>Registro de fornecedores e preços</li>
              <li>Geração de relatórios de consumo e custos</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}