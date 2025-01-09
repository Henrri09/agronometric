import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function GlossarySection() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Glossário</h2>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="ordem-servico">
          <AccordionTrigger>Ordem de Serviço</AccordionTrigger>
          <AccordionContent>
            Documento que registra e controla as solicitações de manutenção, contendo informações sobre o equipamento, 
            tipo de serviço, prioridade, responsável e prazos.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manutencao-preventiva">
          <AccordionTrigger>Manutenção Preventiva</AccordionTrigger>
          <AccordionContent>
            Atividades programadas de manutenção realizadas periodicamente para prevenir falhas e prolongar a vida útil dos equipamentos.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="manutencao-corretiva">
          <AccordionTrigger>Manutenção Corretiva</AccordionTrigger>
          <AccordionContent>
            Intervenções realizadas após a ocorrência de falhas ou problemas nos equipamentos, visando restaurar seu funcionamento normal.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cronograma">
          <AccordionTrigger>Cronograma de Manutenção</AccordionTrigger>
          <AccordionContent>
            Planejamento temporal das atividades de manutenção, incluindo datas previstas para manutenções preventivas e revisões.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="inventario">
          <AccordionTrigger>Inventário de Peças</AccordionTrigger>
          <AccordionContent>
            Controle do estoque de peças e componentes necessários para a realização das manutenções.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}