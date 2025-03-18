
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRaceManagement } from "@/hooks/admin/useRaceManagement";
import { RaceEditForm } from "@/components/admin/RaceEditForm";
import { RacesTable } from "@/components/admin/RacesTable";
import { PlusCircle } from "lucide-react";
import { Toaster } from "sonner";

const AdminRaceManagement = () => {
  const {
    races,
    isLoading,
    selectedRace,
    isEditing,
    raceDate,
    qualifyingDate,
    isSubmitting,
    raceDateDialogOpen,
    qualifyingDateDialogOpen,
    raceTime,
    qualifyingTime,
    isValid,
    raceNumber,
    raceCountry,
    raceName,
    raceCircuit,
    setRaceDate,
    setQualifyingDate,
    setRaceDateDialogOpen,
    setQualifyingDateDialogOpen,
    setRaceTime,
    setQualifyingTime,
    setRaceNumber,
    setRaceCountry,
    setRaceName,
    setRaceCircuit,
    handleEditRace,
    handleSaveRace,
    handleCancel,
    handleValidChange,
    handleDeleteRace,
    handleAddRace
  } = useRaceManagement();

  if (isLoading) {
    return <div className="p-8 text-center text-racing-silver">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-racing-white mb-6">Gerenciamento de Corridas</h1>
        
        {isEditing && selectedRace ? (
          <RaceEditForm 
            selectedRace={selectedRace}
            raceDate={raceDate}
            qualifyingDate={qualifyingDate}
            raceDateDialogOpen={raceDateDialogOpen}
            qualifyingDateDialogOpen={qualifyingDateDialogOpen}
            raceTime={raceTime}
            qualifyingTime={qualifyingTime}
            isSubmitting={isSubmitting}
            isValid={isValid}
            raceNumber={raceNumber}
            raceCountry={raceCountry}
            raceName={raceName}
            raceCircuit={raceCircuit}
            setRaceDate={setRaceDate}
            setQualifyingDate={setQualifyingDate}
            setRaceDateDialogOpen={setRaceDateDialogOpen}
            setQualifyingDateDialogOpen={setQualifyingDateDialogOpen}
            setRaceTime={setRaceTime}
            setQualifyingTime={setQualifyingTime}
            setRaceNumber={setRaceNumber}
            setRaceCountry={setRaceCountry}
            setRaceName={setRaceName}
            setRaceCircuit={setRaceCircuit}
            handleSaveRace={handleSaveRace}
            handleCancel={handleCancel}
            handleValidChange={handleValidChange}
          />
        ) : (
          <Card className="bg-racing-black border-racing-silver/20 text-racing-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Calendário de Corridas</CardTitle>
              <Button 
                onClick={handleAddRace}
                className="bg-racing-red hover:bg-racing-red/80 text-racing-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Corrida
              </Button>
            </CardHeader>
            <CardContent>
              <RacesTable 
                races={races || []} 
                onEditRace={handleEditRace} 
                onDeleteRace={handleDeleteRace} 
              />
            </CardContent>
          </Card>
        )}
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminRaceManagement;
