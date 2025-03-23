
import { QualifyingResultsForm } from "@/components/race-results/QualifyingResultsForm";
import { RaceResultsForm } from "@/components/race-results/RaceResultsForm";
import { AdminHeader } from "@/components/race-results/AdminHeader";
import { useRaceAdminResults } from "@/hooks/race/useRaceAdminResults";
import { useAvailableDrivers } from "@/hooks/race/useAvailableDrivers";
import { Toaster } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

const RaceResultsAdmin = () => {
  const {
    race,
    drivers,
    poleTime,
    setPoleTime,
    formatDisplayPoleTime,
    fastestLap,
    setFastestLap,
    qualifyingResults,
    handleQualifyingDriverChange,
    qualifyingDuplicates,
    raceResults,
    handleRaceDriverChange,
    raceDuplicates,
    dnfDrivers,
    handleDNFChange,
    handleDNFCount,
    saving,
    loading,
    handleSaveResults
  } = useRaceAdminResults();
  
  const { getAvailableDrivers } = useAvailableDrivers();

  const getDriversByPosition = (position: number) => {
    return getAvailableDrivers(position, qualifyingResults, raceResults, drivers || []);
  };

  if (!race || !drivers) {
    return <div className="p-6 text-center text-racing-silver">Carregando...</div>;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black p-4 md:p-6">
        <div className="max-w-5xl mx-auto">
          <AdminHeader 
            raceName={race.name}
            onSave={handleSaveResults}
            isLoading={saving || loading}
          />

          <div className="grid grid-cols-1 gap-8">
            <QualifyingResultsForm 
              poleTime={formatDisplayPoleTime(poleTime)}
              onPoleTimeChange={setPoleTime}
              qualifyingResults={qualifyingResults}
              onQualifyingDriverChange={handleQualifyingDriverChange}
              availableDrivers={getDriversByPosition}
              duplicates={qualifyingDuplicates}
            />

            <RaceResultsForm 
              fastestLap={fastestLap}
              onFastestLapChange={setFastestLap}
              raceResults={raceResults}
              onRaceDriverChange={handleRaceDriverChange}
              dnfDrivers={dnfDrivers}
              onDNFChange={handleDNFChange}
              handleDNFCountChange={(value) => handleDNFCount(parseInt(value, 10))}
              allDrivers={drivers}
              duplicates={raceDuplicates}
            />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    </MainLayout>
  );
};

export default RaceResultsAdmin;
