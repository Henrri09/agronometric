import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function FinancialManagement() {
  return (
    <div className="p-6">
      <PageHeader
        title="Gestão Financeira"
        description="Gerencie dados financeiros e notas fiscais"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">
              Módulo em desenvolvimento para gerenciamento financeiro e emissão de notas fiscais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}