
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QualifyingResultsForm } from "@/components/race-results/QualifyingResultsForm";
import { RaceResultsForm } from "@/components/race-results/RaceResultsForm";
import { useRaceResults } from "@/hooks/useRaceResults";
import type { RaceResult } from "@/types/betting";

const RaceResultsAdmin = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { race, drivers, existingResult, refetch, loading, setLoading } = useRaceResults(raceId);

  const [formData, setFormData] = useState<Partial<RaceResult>>({
    qualifying_results: existingResult?.qualifying_results || Array(20).fill("placeholder"),
    race_results: existingResult?.race_results || Array(20).fill("placeholder"),
    pole_time: existingResult?.pole_time || "",
    fastest_lap: existingResult?.fastest_lap || "placeholder",
    dnf_drivers: existingResult?.dnf_drivers || [],
  });

  const getAvailableDrivers = (position: number, isQualifying: boolean) => {
    if (!drivers) return [];
    const selectedPositions = isQualifying 
      ? formData.qualifying_results 
      : formData.race_results;
    
    return drivers.filter(driver => {
      if (!selectedPositions) return true;
      const isSelected = selectedPositions.includes(driver.id);
      return !isSelected || selectedPositions[position] === driver.id;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Limpar os valores "placeholder" antes de salvar
      const cleanedData = {
        ...formData,
        qualifying_results: formData.qualifying_results?.map(r => r === "placeholder" ? "" : r) || [],
        race_results: formData.race_results?.map(r => r === "placeholder" ? "" : r) || [],
        fastest_lap: formData.fastest_lap === "placeholder" ? "" : formData.fastest_lap,
        race_id: raceId,
      };

      console.log("Dados a serem salvos:", cleanedData); // Log para debug

      if (existingResult) {
        const { error } = await supabase
          .from("race_results")
          .update(cleanedData)
          .eq("id", existingResult.id);

        if (error) {
          console.error("Erro ao atualizar:", error); // Log para debug
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("race_results")
          .insert([cleanedData]);

        if (error) {
          console.error("Erro ao inserir:", error); // Log para debug
          throw error;
        }
      }

      toast({
        title: "Sucesso!",
        description: "Resultados salvos com sucesso.",
      });

      await refetch();
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os resultados. Verifique se você tem permissão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!race || !drivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando dados da corrida...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-racing-white">
            Administrar Resultados: {race.name}
          </h1>
          <Button 
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-racing-silver/20 text-racing-silver hover:bg-racing-silver/10"
          >
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
          <QualifyingResultsForm
            poleTime={formData.pole_time || ""}
            onPoleTimeChange={(value) => setFormData({ ...formData, pole_time: value })}
            qualifyingResults={formData.qualifying_results || []}
            onQualifyingDriverChange={(position, driverId) => {
              const newQualifyingResults = [...(formData.qualifying_results || [])];
              newQualifyingResults[position] = driverId;
              setFormData({ ...formData, qualifying_results: newQualifyingResults });
            }}
            availableDrivers={(position) => getAvailableDrivers(position, true)}
          />

          <RaceResultsForm
            fastestLap={formData.fastest_lap || "placeholder"}
            onFastestLapChange={(value) => setFormData({ ...formData, fastest_lap: value })}
            raceResults={formData.race_results || []}
            onRaceDriverChange={(position, driverId) => {
              const newRaceResults = [...(formData.race_results || [])];
              newRaceResults[position] = driverId;
              setFormData({ ...formData, race_results: newRaceResults });
            }}
            dnfDrivers={formData.dnf_drivers || []}
            onDNFChange={(driverId, checked) => {
              const currentDNFs = [...(formData.dnf_drivers || [])];
              if (checked && !currentDNFs.includes(driverId)) {
                setFormData({ ...formData, dnf_drivers: [...currentDNFs, driverId] });
              } else if (!checked) {
                setFormData({
                  ...formData,
                  dnf_drivers: currentDNFs.filter(id => id !== driverId)
                });
              }
            }}
            availableDrivers={(position) => getAvailableDrivers(position, false)}
            allDrivers={drivers}
          />

          <div className="flex justify-end mt-8">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-racing-red hover:bg-racing-red/90 transition-colors duration-200 min-w-[150px]"
            >
              {loading ? "Salvando..." : "Salvar Resultados"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RaceResultsAdmin;
