
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRaceResults } from "@/hooks/useRaceResults";
import { Button } from "@/components/ui/button";
import { QualifyingResultsForm } from "@/components/race-results/QualifyingResultsForm";
import { RaceResultsForm } from "@/components/race-results/RaceResultsForm";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const RaceResultsAdmin = () => {
  const { raceId } = useParams<{ raceId: string }>();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const { 
    race, 
    drivers, 
    existingResult, 
    refetch,
    loading,
    processPoints
  } = useRaceResults(raceId);

  const [poleTime, setPoleTime] = useState<string>(existingResult?.pole_time || "");
  const [fastestLap, setFastestLap] = useState<string>(existingResult?.fastest_lap || "");
  const [qualifyingResults, setQualifyingResults] = useState<string[]>(
    existingResult?.qualifying_results || Array(20).fill("")
  );
  const [raceResults, setRaceResults] = useState<string[]>(
    existingResult?.race_results || Array(20).fill("")
  );
  const [dnfDrivers, setDNFDrivers] = useState<string[]>(
    existingResult?.dnf_drivers || []
  );

  const handleQualifyingDriverChange = (position: number, driverId: string) => {
    if (driverId === "placeholder") {
      // Remove o piloto da posição selecionada
      const newResults = [...qualifyingResults];
      newResults[position] = "";
      setQualifyingResults(newResults);
      return;
    }

    // Verificar se o piloto já está em outra posição e removê-lo
    const currentIndex = qualifyingResults.findIndex(id => id === driverId);
    if (currentIndex !== -1 && currentIndex !== position) {
      const newResults = [...qualifyingResults];
      newResults[currentIndex] = "";
      newResults[position] = driverId;
      setQualifyingResults(newResults);
    } else {
      const newResults = [...qualifyingResults];
      newResults[position] = driverId;
      setQualifyingResults(newResults);
    }
  };

  const handleRaceDriverChange = (position: number, driverId: string) => {
    if (driverId === "placeholder") {
      // Remove o piloto da posição selecionada
      const newResults = [...raceResults];
      newResults[position] = "";
      setRaceResults(newResults);
      return;
    }

    // Verificar se o piloto já está em outra posição e removê-lo
    const currentIndex = raceResults.findIndex(id => id === driverId);
    if (currentIndex !== -1 && currentIndex !== position) {
      const newResults = [...raceResults];
      newResults[currentIndex] = "";
      newResults[position] = driverId;
      setRaceResults(newResults);
    } else {
      const newResults = [...raceResults];
      newResults[position] = driverId;
      setRaceResults(newResults);
    }
  };

  const handleDNFChange = (driverId: string, checked: boolean) => {
    if (checked) {
      setDNFDrivers(prev => [...prev, driverId]);
    } else {
      setDNFDrivers(prev => prev.filter(id => id !== driverId));
    }
  };

  const getAvailableDrivers = (position: number) => {
    if (!drivers) return [];
    
    // Filtrar pilotos que já estão em resultados
    const currentResults = position < 10 ? qualifyingResults : raceResults;
    const selectedDriverId = currentResults[position];
    
    // Retorna todos os pilotos que não estão em outras posições ou está na posição atual
    return drivers.filter(driver => 
      !currentResults.includes(driver.id) || 
      driver.id === selectedDriverId
    );
  };

  const saveResults = async () => {
    if (!raceId) return;
    
    setSaving(true);
    
    try {
      const result = {
        race_id: raceId,
        qualifying_results: qualifyingResults,
        race_results: raceResults,
        pole_time: poleTime,
        fastest_lap: fastestLap,
        dnf_drivers: dnfDrivers
      };

      // Verificar se já existe um resultado para atualizar ou criar novo
      const { error } = existingResult 
        ? await supabase.from("race_results").update(result).eq("id", existingResult.id)
        : await supabase.from("race_results").insert(result);

      if (error) throw error;
      
      await refetch();
      toast.success("Resultados salvos com sucesso!");
      
      // Calcular pontos automaticamente após salvar
      await processPoints();
      toast.success("Pontos calculados e salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      toast.error("Erro ao salvar resultados");
    } finally {
      setSaving(false);
    }
  };

  if (!race || !drivers) {
    return <div className="p-6 text-center text-racing-silver">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-racing-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-racing-white">{race.name} - Resultados Oficiais</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="bg-transparent border-racing-silver text-racing-silver hover:bg-racing-silver/10"
            >
              Voltar
            </Button>
            <Button 
              disabled={saving || loading}
              onClick={saveResults}
              className="bg-racing-red hover:bg-racing-red/80 text-racing-white"
            >
              {saving || loading ? "Processando..." : "Salvar Resultados"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <QualifyingResultsForm 
            poleTime={poleTime}
            onPoleTimeChange={setPoleTime}
            qualifyingResults={qualifyingResults}
            onQualifyingDriverChange={handleQualifyingDriverChange}
            availableDrivers={getAvailableDrivers}
          />

          <RaceResultsForm 
            fastestLap={fastestLap}
            onFastestLapChange={setFastestLap}
            raceResults={raceResults}
            onRaceDriverChange={handleRaceDriverChange}
            dnfDrivers={dnfDrivers}
            onDNFChange={handleDNFChange}
            availableDrivers={getAvailableDrivers}
            allDrivers={drivers}
          />
        </div>
      </div>
    </div>
  );
};

export default RaceResultsAdmin;
