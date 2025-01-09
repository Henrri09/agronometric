import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function GlossarySection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Glossário</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ordem-servico">
          <AccordionTrigger>Ordem de Serviço</AccordionTrigger>
          <AccordionContent>
            Uma **Ordem de Serviço (OS)** é um documento digital essencial que funciona como um registro detalhado de todas as 
            atividades de manutenção. Ela contém **informações cruciais** como:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Descrição detalhada do problema ou serviço necessário</li>
              <li>**Prioridade** do serviço (Baixa, Média, Alta, Urgente)</li>
              <li>**Tipo de manutenção** a ser realizada</li>
              <li>Identificação do **equipamento** envolvido</li>
              <li>**Responsável** pela execução do serviço</li>
              <li>**Prazos** de início e conclusão</li>
              <li>Possibilidade de anexar **fotos e documentos** relevantes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manutencao-preventiva">
          <AccordionTrigger>Manutenção Preventiva</AccordionTrigger>
          <AccordionContent>
            A **Manutenção Preventiva** é um tipo de manutenção **planejada e programada** que visa evitar falhas antes que elas aconteçam. 
            Seus **principais benefícios** incluem:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>**Redução de paradas não programadas**</li>
              <li>**Aumento da vida útil** dos equipamentos</li>
              <li>**Economia** com reparos de emergência</li>
              <li>**Maior segurança** para os operadores</li>
            </ul>
            É realizada em **intervalos regulares**, seguindo um cronograma baseado em:
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
            A **Manutenção Corretiva** é realizada quando ocorre uma **falha ou problema** em um equipamento que precisa 
            ser corrigido imediatamente. Este tipo de manutenção:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>É realizada de forma **não programada**</li>
              <li>Visa **restaurar o funcionamento** do equipamento</li>
              <li>Pode ser **emergencial** em casos críticos</li>
              <li>Geralmente tem **custos mais elevados** que a preventiva</li>
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
            O **Cronograma de Manutenção** é uma ferramenta de **planejamento essencial** que permite:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>**Visualização clara** de todas as manutenções programadas</li>
              <li>**Organização eficiente** dos recursos e equipes</li>
              <li>**Previsão antecipada** de necessidades de peças e materiais</li>
              <li>**Redução de conflitos** de agendamento</li>
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
            O **Inventário de Peças** é um módulo do sistema que permite o **controle completo** do estoque de componentes 
            e materiais necessários para manutenção. Principais funcionalidades:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>**Controle em tempo real** das quantidades disponíveis</li>
              <li>**Alertas automáticos** de estoque baixo</li>
              <li>**Histórico detalhado** de consumo de peças</li>
              <li>**Rastreamento** de custos e gastos com materiais</li>
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