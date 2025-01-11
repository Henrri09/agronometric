import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface BugReport {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  company: { name: string } | null;
  screenshot_url: string | null;
}

export default function SupportTickets() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchBugReports();
  }, []);

  const fetchBugReports = async () => {
    try {
      const { data, error } = await supabase
        .from('bug_reports')
        .select(`
          *,
          company:companies(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBugReports(data || []);
    } catch (error: any) {
      console.error('Error fetching bug reports:', error);
      toast.error("Erro ao carregar os tickets");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      in_progress: "bg-blue-500",
      resolved: "bg-green-500",
      closed: "bg-gray-500"
    };
    return colors[status as keyof typeof colors] || "bg-gray-500";
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bug_reports')
        .update({ status: newStatus })
        .eq('id', reportId);

      if (error) throw error;
      
      toast.success("Status atualizado com sucesso");
      fetchBugReports();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const handleResponseSubmit = async (reportId: string) => {
    const responseText = responses[reportId];
    if (!responseText?.trim()) {
      toast.error("Por favor, insira uma resposta");
      return;
    }

    try {
      const { error } = await supabase
        .from('bug_report_responses')
        .insert({
          bug_report_id: reportId,
          response_text: responseText,
          responded_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success("Resposta enviada com sucesso");
      setResponses(prev => ({ ...prev, [reportId]: '' }));
    } catch (error: any) {
      console.error('Error sending response:', error);
      toast.error("Erro ao enviar resposta");
    }
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Central de Suporte"
        description="Gerencie os tickets de suporte e reports de bug"
      />
      
      <Tabs defaultValue="bugs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bugs">Reports de Bug</TabsTrigger>
          <TabsTrigger value="support">Tickets de Suporte</TabsTrigger>
        </TabsList>

        <TabsContent value="bugs">
          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Screenshot</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Ações</TableHead>
                    <TableHead>Resposta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bugReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.company?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground">{report.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {report.screenshot_url && (
                          <a 
                            href={report.screenshot_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Ver imagem
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(report.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <select
                          className="border rounded p-1"
                          value={report.status}
                          onChange={(e) => handleStatusUpdate(report.id, e.target.value)}
                        >
                          <option value="pending">Pendente</option>
                          <option value="in_progress">Em Progresso</option>
                          <option value="resolved">Resolvido</option>
                          <option value="closed">Fechado</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Textarea
                            value={responses[report.id] || ''}
                            onChange={(e) => setResponses(prev => ({
                              ...prev,
                              [report.id]: e.target.value
                            }))}
                            placeholder="Digite sua resposta..."
                            className="min-w-[200px]"
                          />
                          <Button
                            onClick={() => handleResponseSubmit(report.id)}
                            size="sm"
                          >
                            Enviar Resposta
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                Funcionalidade de tickets de suporte em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}