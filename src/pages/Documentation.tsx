import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutorialVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
}

export default function Documentation() {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);

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

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Documentação"
        description="Tutoriais e guias para ajudar você a utilizar o sistema"
      />

      {/* Glossário e Informações do Projeto */}
      <Card>
        <CardHeader>
          <CardTitle>Glossário e Informações do Projeto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Ordem de Serviço (OS)</h3>
            <p className="text-muted-foreground">
              Documento que registra uma solicitação de manutenção ou reparo, contendo informações
              detalhadas sobre o serviço a ser realizado, incluindo descrição do problema,
              prioridade, responsável e prazos.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Manutenção Preventiva</h3>
            <p className="text-muted-foreground">
              Atividades programadas de manutenção realizadas em intervalos regulares para
              prevenir falhas e prolongar a vida útil dos equipamentos.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Manutenção Corretiva</h3>
            <p className="text-muted-foreground">
              Atividades de manutenção realizadas após a ocorrência de uma falha para
              restaurar o funcionamento normal do equipamento.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Kanban</h3>
            <p className="text-muted-foreground">
              Sistema visual de gestão de trabalho que permite acompanhar o progresso das
              atividades através de cartões organizados em colunas que representam diferentes
              estágios do processo.
            </p>
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