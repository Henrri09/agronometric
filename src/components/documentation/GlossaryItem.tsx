import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface GlossaryItemProps {
  term: string;
  definition: string;
  details?: string[];
  image?: string;
}

export const GlossaryItem = ({ term, definition, details, image }: GlossaryItemProps) => {
  return (
    <AccordionItem value={term}>
      <AccordionTrigger className="text-left">
        {term}
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        <p>{definition}</p>
        {details && (
          <ul className="list-none space-y-2">
            {details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        )}
        {image && (
          <div className="mt-4">
            <img 
              src={image} 
              alt={term}
              className="rounded-lg max-w-full h-auto"
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};