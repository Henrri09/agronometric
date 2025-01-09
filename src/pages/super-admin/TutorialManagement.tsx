import { useState, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutorialVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  created_at: string;
}

export default function TutorialManagement() {
  const [videos, setVideos] = useState<TutorialVideo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video_url: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('tutorial_videos')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Tutorial atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from('tutorial_videos')
          .insert(formData);

        if (error) throw error;
        toast.success("Tutorial adicionado com sucesso!");
      }

      setFormData({ title: "", description: "", video_url: "" });
      setIsAdding(false);
      setEditingId(null);
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar tutorial");
    }
  };

  const handleEdit = (video: TutorialVideo) => {
    setFormData({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
    });
    setEditingId(video.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tutorial_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success("Tutorial removido com sucesso!");
      fetchVideos();
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover tutorial");
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Gerenciamento de Tutoriais"
        description="Adicione e gerencie vídeos tutoriais para os usuários"
      />
      
      <div className="mb-6">
        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isAdding ? "Cancelar" : "Adicionar Tutorial"}
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Título
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="video_url" className="block text-sm font-medium mb-1">
                  URL do Vídeo
                </label>
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingId ? "Atualizar" : "Adicionar"} Tutorial
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell>{video.description}</TableCell>
                  <TableCell className="max-w-xs truncate">{video.video_url}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(video)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(video.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}