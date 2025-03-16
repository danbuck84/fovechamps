import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatDate, getDateInTimeZone } from "@/utils/date-utils";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const AdminRaceManagement = () => {
  const [selectedRace, setSelectedRace] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [raceDate, setRaceDate] = useState<Date | undefined>(undefined);
  const [qualifyingDate, setQualifyingDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [raceDateDialogOpen, setRaceDateDialogOpen] = useState(false);
  const [qualifyingDateDialogOpen, setQualifyingDateDialogOpen] = useState(false);
  const [raceTime, setRaceTime] = useState("00:00");
  const [qualifyingTime, setQualifyingTime] = useState("00:00");

  const { data: races, isLoading, refetch } = useQuery({
    queryKey: ["admin-races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (selectedRace) {
      const raceDateTime = getDateInTimeZone(selectedRace.date);
      const qualifyingDateTime = getDateInTimeZone(selectedRace.qualifying_date);
      
      setRaceDate(raceDateTime);
      setQualifyingDate(qualifyingDateTime);
      
      setRaceTime(format(raceDateTime, "HH:mm"));
      setQualifyingTime(format(qualifyingDateTime, "HH:mm"));
    }
  }, [selectedRace]);

  const handleEditRace = (race: any) => {
    setSelectedRace(race);
    setIsEditing(true);
  };

  const handleSaveRace = async () => {
    if (!selectedRace || !raceDate || !qualifyingDate) {
      toast.error("Por favor, preencha todas as informações");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const raceDateTime = new Date(raceDate);
      const [raceHours, raceMinutes] = raceTime.split(':').map(Number);
      raceDateTime.setHours(raceHours, raceMinutes);

      const qualifyingDateTime = new Date(qualifyingDate);
      const [qualifyingHours, qualifyingMinutes] = qualifyingTime.split(':').map(Number);
      qualifyingDateTime.setHours(qualifyingHours, qualifyingMinutes);
      
      // Convert to ISO string for database
      const race_date_iso = raceDateTime.toISOString();
      const qualifying_date_iso = qualifyingDateTime.toISOString();

      console.log('Saving race details:', {
        id: selectedRace.id,
        date: race_date_iso,
        qualifying_date: qualifying_date_iso
      });

      // Update race in Supabase
      const { data, error } = await supabase
        .from("races")
        .update({
          date: race_date_iso,
          qualifying_date: qualifying_date_iso
        })
        .eq("id", selectedRace.id)
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log('Update response:', data);
      toast.success("Datas da corrida atualizadas com sucesso");
      setIsEditing(false);
      setSelectedRace(null);
      await refetch();
    } catch (error) {
      console.error("Erro ao atualizar corrida:", error);
      toast.error("Erro ao atualizar datas da corrida");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRace(null);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-racing-silver">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-racing-white mb-6">Gerenciamento de Corridas</h1>
        
        {isEditing ? (
          <Card className="bg-racing-black border-racing-silver/20 text-racing-white mb-6">
            <CardHeader>
              <CardTitle>Editar Datas: {selectedRace.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="race-date" className="text-racing-white">Data da Corrida</Label>
                  <div className="flex items-center gap-2">
                    <Dialog open={raceDateDialogOpen} onOpenChange={setRaceDateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10 w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {raceDate ? format(raceDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar Data"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-racing-black border-racing-silver/20 text-racing-white">
                        <DialogHeader>
                          <DialogTitle>Selecionar Data da Corrida</DialogTitle>
                        </DialogHeader>
                        <Calendar
                          mode="single"
                          selected={raceDate}
                          onSelect={(date) => {
                            setRaceDate(date);
                            setRaceDateDialogOpen(false);
                          }}
                          locale={ptBR}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Input 
                      id="race-time" 
                      type="time"
                      value={raceTime}
                      onChange={(e) => setRaceTime(e.target.value)}
                      className="w-32 bg-transparent border-racing-silver text-racing-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="qualifying-date" className="text-racing-white">Data da Classificação (Prazo para apostas)</Label>
                  <div className="flex items-center gap-2">
                    <Dialog open={qualifyingDateDialogOpen} onOpenChange={setQualifyingDateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10 w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {qualifyingDate ? format(qualifyingDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar Data"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-racing-black border-racing-silver/20 text-racing-white">
                        <DialogHeader>
                          <DialogTitle>Selecionar Data da Classificação</DialogTitle>
                        </DialogHeader>
                        <Calendar
                          mode="single"
                          selected={qualifyingDate}
                          onSelect={(date) => {
                            setQualifyingDate(date);
                            setQualifyingDateDialogOpen(false);
                          }}
                          locale={ptBR}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Input 
                      id="qualifying-time" 
                      type="time"
                      value={qualifyingTime}
                      onChange={(e) => setQualifyingTime(e.target.value)}
                      className="w-32 bg-transparent border-racing-silver text-racing-white"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveRace}
                  disabled={isSubmitting}
                  className="bg-racing-red hover:bg-racing-red/80 text-racing-white"
                >
                  {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-racing-black border-racing-silver/20 text-racing-white">
            <CardHeader>
              <CardTitle>Calendário de Corridas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-racing-silver/20">
                    <TableHead className="text-racing-silver">Nome da Corrida</TableHead>
                    <TableHead className="text-racing-silver">Data da Corrida</TableHead>
                    <TableHead className="text-racing-silver">Data da Classificação</TableHead>
                    <TableHead className="text-racing-silver w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {races && races.length > 0 ? (
                    races.map((race) => (
                      <TableRow key={race.id} className="border-racing-silver/20">
                        <TableCell className="text-racing-white font-medium">{race.name}</TableCell>
                        <TableCell className="text-racing-silver">{formatDate(race.date)}</TableCell>
                        <TableCell className="text-racing-silver">{formatDate(race.qualifying_date)}</TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleEditRace(race)}
                            className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
                            variant="outline"
                            size="sm"
                          >
                            Editar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-racing-silver">
                        Nenhuma corrida encontrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminRaceManagement;
