import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const columns = [
  {
    title: "A Fazer",
    tasks: [
      { id: 1, title: "Manutenção Esteira X1000", priority: "Alta" },
      { id: 2, title: "Calibração Empacotadora", priority: "Média" },
    ]
  },
  {
    title: "Em Andamento",
    tasks: [
      { id: 3, title: "Troca de Peças Misturador", priority: "Alta" },
      { id: 4, title: "Limpeza Sistema", priority: "Baixa" },
    ]
  },
  {
    title: "Concluído",
    tasks: [
      { id: 5, title: "Atualização Software", priority: "Média" },
      { id: 6, title: "Inspeção Rotina", priority: "Baixa" },
    ]
  }
];

export default function KanbanBoard() {
  return (
    <div className="p-6">
      <PageHeader
        title="Quadro Kanban"
        description="Visualize e gerencie as tarefas em andamento"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.title}>
            <CardHeader>
              <CardTitle>{column.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Prioridade: {task.priority}
                    </p>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}