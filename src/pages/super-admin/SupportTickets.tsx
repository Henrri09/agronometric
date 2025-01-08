import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  company: { name: string } | null;
}

export default function SupportTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          company:companies(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast.error(error.message || "Erro ao carregar tickets");
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-500",
      medium: "bg-yellow-500",
      high: "bg-orange-500",
      urgent: "bg-red-500"
    };
    return colors[priority as keyof typeof colors] || "bg-gray-500";
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
    <div className="p-6">
      <PageHeader
        title="Tickets de Suporte"
        description="Gerencie os tickets de suporte dos usuários"
      />
      
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.company?.name || 'N/A'}</TableCell>
                  <TableCell>{ticket.title}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
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