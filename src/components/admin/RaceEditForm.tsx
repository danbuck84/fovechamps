
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RaceEditFormProps {
  selectedRace: any;
  raceDate: Date | undefined;
  qualifyingDate: Date | undefined;
  raceDateDialogOpen: boolean;
  qualifyingDateDialogOpen: boolean;
  raceTime: string;
  qualifyingTime: string;
  isSubmitting: boolean;
  isValid: boolean;
  setRaceDate: (date: Date | undefined) => void;
  setQualifyingDate: (date: Date | undefined) => void;
  setRaceDateDialogOpen: (open: boolean) => void;
  setQualifyingDateDialogOpen: (open: boolean) => void;
  setRaceTime: (time: string) => void;
  setQualifyingTime: (time: string) => void;
  handleSaveRace: () => Promise<void>;
  handleCancel: () => void;
  handleValidChange: (isValid: boolean) => void;
}

export const RaceEditForm = ({
  selectedRace,
  raceDate,
  qualifyingDate,
  raceDateDialogOpen,
  qualifyingDateDialogOpen,
  raceTime,
  qualifyingTime,
  isSubmitting,
  isValid,
  setRaceDate,
  setQualifyingDate,
  setRaceDateDialogOpen,
  setQualifyingDateDialogOpen,
  setRaceTime,
  setQualifyingTime,
  handleSaveRace,
  handleCancel,
  handleValidChange
}: RaceEditFormProps) => {
  return (
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

          <div className="flex items-center space-x-2">
            <Switch 
              id="is-valid" 
              checked={isValid} 
              onCheckedChange={handleValidChange}
              className="data-[state=checked]:bg-racing-red"
            />
            <Label htmlFor="is-valid" className="text-racing-white">
              É válida para o campeonato?
            </Label>
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
  );
};
