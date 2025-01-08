import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SystemGuide {
  title: string;
  content: string;
}

interface SystemGuidesProps {
  guides: SystemGuide[];
}

export const SystemGuides = ({ guides }: SystemGuidesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guias do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {guides.map((guide, index) => (
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
  );
};