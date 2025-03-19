
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DateSelectorProps {
  label: string;
  description?: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  dialogOpen: boolean;
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;
  setDialogOpen: (open: boolean) => void;
}

export const DateSelector = ({
  label,
  description,
  selectedDate,
  selectedTime,
  dialogOpen,
  setSelectedDate,
  setSelectedTime,
  setDialogOpen
}: DateSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`${label.toLowerCase()}-date`} className="text-racing-white">{label}</Label>
      {description && <p className="text-racing-silver text-sm">{description}</p>}
      <div className="flex items-center gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10 w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar Data"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-racing-black border-racing-silver/20 text-racing-white">
            <DialogHeader>
              <DialogTitle>Selecionar Data da {label}</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setDialogOpen(false);
              }}
              locale={ptBR}
            />
          </DialogContent>
        </Dialog>
        
        <span className="text-racing-silver">às</span>
        
        <Input 
          id={`${label.toLowerCase()}-time`}
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="w-32 bg-transparent border-racing-silver text-racing-white"
        />
      </div>
    </div>
  );
};
