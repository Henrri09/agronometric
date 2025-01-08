import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Sports() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSport, setNewSport] = useState("");
  
  // Mockup de dados - será substituído pela integração com o banco
  const sports = [
    { id: 1, name: "Futebol" },
    { id: 2, name: "Vôlei" },
    { id: 3, name: "Basquete" },
  ];

  const handleAddSport = () => {
    if (!newSport.trim()) {
      toast.error("Por favor, insira o nome do esporte");
      return;
    }
    
    // TODO: Implementar integração com o banco
    toast.success("Esporte adicionado com sucesso!");
    setIsDialogOpen(false);
    setNewSport("");
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Esportes"
        description="Gerencie os esportes disponíveis na plataforma"
      />
      
      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Esporte
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Esporte</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sports.map((sport) => (
                <TableRow key={sport.id}>
                  <TableCell>{sport.name}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Esporte</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Nome do esporte"
                value={newSport}
                onChange={(e) => setNewSport(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSport}>
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}