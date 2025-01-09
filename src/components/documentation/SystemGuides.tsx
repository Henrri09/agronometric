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
      </Accordion>
    </div>
  )
}