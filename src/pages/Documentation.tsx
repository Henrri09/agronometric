import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bug } from "lucide-react";
import { GlossarySection } from "@/components/documentation/GlossarySection";
import { SystemGuides } from "@/components/documentation/SystemGuides";

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
      <PageHeader
        title="Documentação do Sistema"
        description="Documentação completa e tutoriais do sistema"
      />

      <Card>
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* Sobre o Sistema */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sobre o Sistema</h2>
              <p className="text-muted-foreground">
                Este sistema foi desenvolvido para gerenciar e controlar as atividades de manutenção de maquinários, 
                permitindo o acompanhamento de ordens de serviço, gestão de inventário de peças e planejamento de 
                manutenções preventivas.
              </p>
            </div>

            {/* Glossário */}
            <GlossarySection />

            {/* Guias do Sistema */}
            <SystemGuides />

            {/* Tutoriais em Vídeo */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Tutoriais em Vídeo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <Card key={video.id}>
                    <CardContent className="p-4">
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
            </div>
          </div>
        </CardContent>
      </Card>

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
  );
}