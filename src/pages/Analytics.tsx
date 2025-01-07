import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', preventivas: 4, corretivas: 2 },
  { name: 'Fev', preventivas: 3, corretivas: 1 },
  { name: 'Mar', preventivas: 5, corretivas: 3 },
  { name: 'Abr', preventivas: 6, corretivas: 2 },
  { name: 'Mai', preventivas: 4, corretivas: 4 },
  { name: 'Jun', preventivas: 7, corretivas: 1 },
];

export default function Analytics() {
  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        description="Análise detalhada dos dados do sistema"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manutenções Preventivas vs Corretivas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="preventivas" fill="#4CAF50" name="Preventivas" />
                  <Bar dataKey="corretivas" fill="#F44336" name="Corretivas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Custos de Manutenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Gráfico de Custos
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Eficiência Operacional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Gráfico de Eficiência
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}