import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { GlossarySection } from "@/components/documentation/GlossarySection";
import { SystemGuides } from "@/components/documentation/SystemGuides";
import { TutorialVideos } from "@/components/documentation/TutorialVideos";
import { BugReportDialog } from "@/components/documentation/BugReportDialog";

export default function Documentation() {
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
            <TutorialVideos />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <BugReportDialog />
      </div>
    </div>
  );
}