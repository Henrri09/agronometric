import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { ptBR } from "date-fns/locale";

// Dados de exemplo para eventos
const events = [
  { date: new Date(2024, 0, 15), title: "Manutenção Trator John Deere", type: "maintenance" },
  { date: new Date(2024, 0, 20), title: "Revisão Colheitadeira", type: "review" },
  { date: new Date(2024, 0, 25), title: "Troca de Óleo", type: "maintenance" },
];

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Filtra eventos para a data selecionada
  const selectedDateEvents = events.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );

  return (
    <div className="p-6">
      <PageHeader
        title="Calendário"
        description="Gerencie eventos e manutenções programadas"
      />

      <div className="grid gap-6 md:grid-cols-[400px,1fr] mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Eventos do Dia {date?.toLocaleDateString('pt-BR')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.date.toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant={event.type === 'maintenance' ? 'destructive' : 'secondary'}>
                      {event.type === 'maintenance' ? 'Manutenção' : 'Revisão'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Nenhum evento programado para esta data.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}