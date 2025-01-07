import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockTasks = {
  todo: [
    {
      title: "Manutenção Preventiva - Esteira Principal",
      description: "Realizar lubrificação e verificação geral dos rolamentos da esteira principal",
      tags: ["todo", "corretiva"],
      date: "10 de Janeiro",
    }
  ],
  inProgress: [
    {
      title: "Manutenção Preventiva - Esteira Principal",
      description: "Realizar lubrificação e verificação geral dos rolamentos da esteira principal",
      tags: ["todo", "preventiva"],
      date: "07 de Janeiro",
    }
  ],
  review: [],
  done: [],
};

export default function KanbanBoard() {
  return (
    <div className="p-6">
      <PageHeader
        title="Kanban"
        description="Arraste e solte os cards para organizar as tarefas"
      />
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar tarefas..."
            className="px-4 py-2 border rounded-lg w-96"
          />
          <Button variant="outline">Todas as prioridades</Button>
          <Button variant="outline">Filtrar por data</Button>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Object.entries(mockTasks).map(([status, tasks]) => (
          <div key={status} className="bg-muted/10 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</h3>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm">
                {tasks.length} {tasks.length === 1 ? 'tarefa' : 'tarefas'}
              </span>
            </div>
            
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">{task.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 rounded-full text-xs ${
                            tag === 'preventiva'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-warning/20 text-warning'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{task.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}