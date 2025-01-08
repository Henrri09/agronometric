import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BugReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BugReportDialog = ({ open, onOpenChange }: BugReportDialogProps) => {
  const [bugReport, setBugReport] = useState({
    title: "",
    description: "",
    screenshot: null as File | null
  });

  const handleBugReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      let screenshotUrl = null;

      if (bugReport.screenshot) {
        const fileExt = bugReport.screenshot.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('bug_screenshots')
          .upload(fileName, bugReport.screenshot);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('bug_screenshots')
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
      }

      const { error } = await supabase
        .from('bug_reports')
        .insert({
          title: bugReport.title,
          description: bugReport.description,
          screenshot_url: screenshotUrl,
          reporter_id: user?.id,
          company_id: profile?.company_id
        });

      if (error) throw error;

      toast.success("Bug reportado com sucesso!");
      onOpenChange(false);
      setBugReport({ title: "", description: "", screenshot: null });
    } catch (error: any) {
      toast.error("Erro ao reportar bug: " + error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar Bug</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleBugReport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={bugReport.title}
              onChange={(e) => setBugReport(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Descreva o problema brevemente"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição Detalhada</Label>
            <Textarea
              id="description"
              value={bugReport.description}
              onChange={(e) => setBugReport(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o problema em detalhes"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="screenshot">Screenshot (opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={(e) => setBugReport(prev => ({ 
                  ...prev, 
                  screenshot: e.target.files ? e.target.files[0] : null 
                }))}
              />
              <Image className="h-4 w-4" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Enviar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};