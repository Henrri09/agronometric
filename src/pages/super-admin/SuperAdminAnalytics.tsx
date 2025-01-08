import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { month: 'Jan', receita: 4000, empresasAtivas: 24, churn: 2 },
  { month: 'Fev', receita: 4500, empresasAtivas: 28, churn: 1 },
  { month: 'Mar', receita: 5100, empresasAtivas: 32, churn: 3 },
];

export default function SuperAdminAnalytics() {
  return (
    <div className="p-6">
      <PageHeader
        title="Analytics"
        description="Análise de receita, churn e empresas ativas"
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="receita" fill="#4CAF50" name="Receita" />
                  <Bar yAxisId="right" dataKey="empresasAtivas" fill="#2196F3" name="Empresas Ativas" />
                  <Bar yAxisId="right" dataKey="churn" fill="#F44336" name="Churn" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}