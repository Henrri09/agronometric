import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TutorialVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
}

export function TutorialVideos() {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      console.log("Fetching tutorial videos...");
      const { data, error } = await supabase
        .from('tutorial_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching videos:", error);
        throw error;
      }
      
      console.log("Fetched videos:", data);
      setVideos(data || []);
    } catch (error: any) {
      console.error("Error in fetchVideos:", error);
      toast.error("Erro ao carregar vídeos tutoriais");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Carregando tutoriais...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Tutoriais em Vídeo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardContent className="p-4">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <iframe
                  src={video.video_url}
                  title={video.title}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </AspectRatio>
              <h3 className="text-lg font-semibold mt-4 mb-2">{video.title}</h3>
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