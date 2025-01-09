import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutorialVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
}

export function TutorialVideos() {
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
  );
}