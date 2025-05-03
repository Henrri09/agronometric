import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bug, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCompanyId } from "@/hooks/useCompanyId";


export function BugReportDialog() {
  const [bugReport, setBugReport] = useState({ title: "", description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const { companyId } = useCompanyId();

  const handleBugReport = async () => {
    if (!bugReport.title || !bugReport.description) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      let screenshot_url = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('bug_screenshots')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('bug_screenshots')
          .getPublicUrl(fileName);

        screenshot_url = publicUrl;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Usuário não encontrado");
        return;
      }

      const { error } = await supabase
        .from('bug_reports')
        .insert([{
          title: bugReport.title,
          description: bugReport.description,
          screenshot_url,
          company_id: companyId,
          reporter_id: user?.id,
        }]);

      if (error) throw error;

      toast.success("Bug reportado com sucesso!");
      setBugReport({ title: "", description: "" });
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao reportar bug");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <div>
            <label htmlFor="screenshot" className="text-sm font-medium block mb-2">
              Screenshot (opcional)
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('screenshot')?.click()}
                className="w-full gap-2"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Selecionar imagem"}
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedFile(null)}
                  className="text-destructive"
                >
                  Remover
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Máximo: 5MB. Formatos aceitos: PNG, JPG, JPEG
            </p>
          </div>
          <Button
            onClick={handleBugReport}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}