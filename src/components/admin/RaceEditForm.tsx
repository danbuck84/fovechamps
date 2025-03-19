
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RaceInfoFields } from "./race-edit/RaceInfoFields";
import { DateSelector } from "./race-edit/DateSelector";
import { ValidationToggle } from "./race-edit/ValidationToggle";
import { FormActions } from "./race-edit/FormActions";

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
  setRaceNumber: (number: string) => void;
  setRaceCountry: (country: string) => void;
  setRaceName: (name: string) => void;
  setRaceCircuit: (circuit: string) => void;
  raceNumber: string;
  raceCountry: string;
  raceName: string;
  raceCircuit: string;
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
  handleValidChange,
  setRaceNumber,
  setRaceCountry,
  setRaceName,
  setRaceCircuit,
  raceNumber,
  raceCountry,
  raceName,
  raceCircuit
}: RaceEditFormProps) => {
  return (
    <Card className="bg-racing-black border-racing-silver/20 text-racing-white mb-6">
      <CardHeader>
        <CardTitle>Editar Corrida: {selectedRace.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 mb-6">
          <RaceInfoFields 
            raceNumber={raceNumber}
            raceCountry={raceCountry}
            raceName={raceName}
            raceCircuit={raceCircuit}
            setRaceNumber={setRaceNumber}
            setRaceCountry={setRaceCountry}
            setRaceName={setRaceName}
            setRaceCircuit={setRaceCircuit}
          />

          <DateSelector 
            label="Corrida"
            selectedDate={raceDate}
            selectedTime={raceTime}
            dialogOpen={raceDateDialogOpen}
            setSelectedDate={setRaceDate}
            setSelectedTime={setRaceTime}
            setDialogOpen={setRaceDateDialogOpen}
          />
          
          <DateSelector 
            label="Classificação"
            description="(Prazo para apostas)"
            selectedDate={qualifyingDate}
            selectedTime={qualifyingTime}
            dialogOpen={qualifyingDateDialogOpen}
            setSelectedDate={setQualifyingDate}
            setSelectedTime={setQualifyingTime}
            setDialogOpen={setQualifyingDateDialogOpen}
          />

          <ValidationToggle 
            isValid={isValid}
            onValidChange={handleValidChange}
          />
        </div>
        
        <FormActions 
          isSubmitting={isSubmitting}
          onCancel={handleCancel}
          onSave={handleSaveRace}
        />
      </CardContent>
    </Card>
  );
};
