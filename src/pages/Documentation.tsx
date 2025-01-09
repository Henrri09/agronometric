import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bug } from "lucide-react";

interface TutorialVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
}

export default function Documentation() {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [bugReport, setBugReport] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('tutorial_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar vídeos");
    }
  };

  const handleBugReport = async () => {
    try {
      const { error } = await supabase
        .from('bug_reports')
        .insert([{
          title: bugReport.title,
          description: bugReport.description,
        }]);

      if (error) throw error;
      toast.success("Bug reportado com sucesso!");
      setBugReport({ title: "", description: "" });
    } catch (error: any) {
      toast.error(error.message || "Erro ao reportar bug");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="Documentação"
          description="Tutoriais e guias para ajudar você a utilizar o sistema"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Bug className="h-4 w-4" />
              Reportar Bug
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reportar Bug</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="bug-title" className="text-sm font-medium">Título</label>
                <Input
                  id="bug-title"
                  value={bugReport.title}
                  onChange={(e) => setBugReport(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Descreva o problema brevemente"
                />
              </div>
              <div>
                <label htmlFor="bug-description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="bug-description"
                  value={bugReport.description}
                  onChange={(e) => setBugReport(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o problema em detalhes"
                  rows={5}
                />
              </div>
              <Button onClick={handleBugReport} className="w-full">Enviar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Glossário e Guia do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Glossário e Guia do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dashboard */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dashboard</h3>
            <p className="text-muted-foreground mb-2">
              Página inicial que apresenta uma visão geral do sistema com indicadores importantes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Visualize gráficos de desempenho e estatísticas</li>
              <li>Acompanhe ordens de serviço em andamento</li>
              <li>Monitore indicadores de manutenção preventiva</li>
              <li>Acesse atalhos para as principais funcionalidades</li>
            </ul>
          </div>

          <Separator />

          {/* Ordens de Serviço */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Ordens de Serviço</h3>
            <p className="text-muted-foreground mb-2">
              Gerencie todas as solicitações de manutenção e reparos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Crie novas ordens de serviço com detalhes completos</li>
              <li>Atribua responsáveis e defina prioridades</li>
              <li>Acompanhe o status e progresso das ordens</li>
              <li>Anexe fotos e documentos relevantes</li>
              <li>Registre o tempo e recursos utilizados</li>
            </ul>
          </div>

          <Separator />

          {/* Maquinário */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Maquinário</h3>
            <p className="text-muted-foreground mb-2">
              Cadastro e controle completo dos equipamentos:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cadastre novos equipamentos com informações detalhadas</li>
              <li>Mantenha histórico de manutenções</li>
              <li>Acompanhe status e condições dos equipamentos</li>
              <li>Gerencie documentação técnica</li>
            </ul>
          </div>

          <Separator />

          {/* Estoque de Peças */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Estoque de Peças</h3>
            <p className="text-muted-foreground mb-2">
              Controle do inventário de peças e componentes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Gerencie o estoque de peças de reposição</li>
              <li>Configure alertas de estoque mínimo</li>
              <li>Registre entradas e saídas</li>
              <li>Acompanhe custos e fornecedores</li>
            </ul>
          </div>

          <Separator />

          {/* Calendário */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Calendário</h3>
            <p className="text-muted-foreground mb-2">
              Visualização e planejamento de atividades:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Visualize manutenções programadas</li>
              <li>Agende novas manutenções preventivas</li>
              <li>Gerencie prazos e compromissos</li>
              <li>Sincronize com ordens de serviço</li>
            </ul>
          </div>

          <Separator />

          {/* Kanban */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Kanban</h3>
            <p className="text-muted-foreground mb-2">
              Gestão visual do fluxo de trabalho:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Visualize o status de todas as tarefas</li>
              <li>Arraste e solte para atualizar status</li>
              <li>Organize por prioridade e responsável</li>
              <li>Acompanhe o progresso em tempo real</li>
            </ul>
          </div>

          <Separator />

          {/* Usuários */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Usuários</h3>
            <p className="text-muted-foreground mb-2">
              Gestão de acesso e permissões:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Cadastre novos usuários</li>
              <li>Defina níveis de acesso e permissões</li>
              <li>Gerencie perfis e informações</li>
              <li>Monitore atividades dos usuários</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Tutoriais */}
      <Card>
        <CardHeader>
          <CardTitle>Tutoriais em Vídeo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-6">
                  <div className="aspect-video mb-4">
                    <iframe
                      src={video.video_url}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {videos.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhum tutorial disponível no momento.
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}