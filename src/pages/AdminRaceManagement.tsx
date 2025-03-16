
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRaceManagement } from "@/hooks/admin/useRaceManagement";
import { RaceEditForm } from "@/components/admin/RaceEditForm";
import { RacesTable } from "@/components/admin/RacesTable";

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
    setRaceDate,
    setQualifyingDate,
    setRaceDateDialogOpen,
    setQualifyingDateDialogOpen,
    setRaceTime,
    setQualifyingTime,
    handleEditRace,
    handleSaveRace,
    handleCancel
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
            setRaceDate={setRaceDate}
            setQualifyingDate={setQualifyingDate}
            setRaceDateDialogOpen={setRaceDateDialogOpen}
            setQualifyingDateDialogOpen={setQualifyingDateDialogOpen}
            setRaceTime={setRaceTime}
            setQualifyingTime={setQualifyingTime}
            handleSaveRace={handleSaveRace}
            handleCancel={handleCancel}
          />
        ) : (
          <Card className="bg-racing-black border-racing-silver/20 text-racing-white">
            <CardHeader>
              <CardTitle>Calendário de Corridas</CardTitle>
            </CardHeader>
            <CardContent>
              <RacesTable races={races || []} onEditRace={handleEditRace} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminRaceManagement;
