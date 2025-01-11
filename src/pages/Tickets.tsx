import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BugReportDialog } from "@/components/documentation/BugReportDialog";

interface BugReport {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  responses: {
    response_text: string;
    created_at: string;
  }[];
}

export default function Tickets() {
  const [bugReports, setBugReports] = useState<BugReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBugReports();
  }, []);

  const fetchBugReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bug_reports')
        .select(`
          *,
          responses:bug_report_responses(response_text, created_at)
        `)
        .eq('reporter_id', user.id)
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

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Meus Tickets"
        description="Visualize e gerencie seus tickets de suporte"
      />

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Respostas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugReports.map((report) => (
                <TableRow key={report.id}>
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
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {report.responses?.map((response, index) => (
                        <div key={index} className="bg-muted p-2 rounded-md">
                          <p className="text-sm">{response.response_text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(response.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {!report.responses?.length && (
                        <p className="text-sm text-muted-foreground">Nenhuma resposta ainda</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-start">
        <BugReportDialog />
      </div>
    </div>
  );
}