import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AboutSystem = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sobre o Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Este sistema foi desenvolvido para gerenciar e controlar as atividades de manutenção
          de maquinários, permitindo o acompanhamento de ordens de serviço, gestão de inventário
          de peças e planejamento de manutenções preventivas.
        </p>
      </CardContent>
    </Card>
  );
};