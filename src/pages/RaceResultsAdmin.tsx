
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { QualifyingResultsForm } from "@/components/race-results/QualifyingResultsForm";
import { RaceResultsForm } from "@/components/race-results/RaceResultsForm";
import { useRaceResults } from "@/hooks/useRaceResults";
import { formatPoleTime } from "@/utils/prediction-utils";
import type { RaceResult } from "@/types/betting";
import { DNFPredictionForm } from "@/components/race-predictions/DNFPredictionForm";
import { Card, CardContent } from "@/components/ui/card";

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
        pole_time: formData.pole_time || "",
        dnf_drivers: formData.dnf_drivers || [],
        race_id: raceId,
      };

      console.log("Dados a serem salvos:", cleanedData);

      let error;
      if (existingResult) {
        const result = await supabase
          .from("race_results")
          .update(cleanedData)
          .eq("id", existingResult.id);
        
        error = result.error;
      } else {
        const result = await supabase
          .from("race_results")
          .insert([cleanedData]);
        
        error = result.error;
      }

      if (error) {
        console.error("Erro ao salvar:", error);
        throw error;
      }

      await refetch();

      toast({
        title: "Sucesso!",
        description: "Resultados salvos com sucesso.",
        duration: 3000,
      });

      // Redirecionar para a página de resultados da corrida
      navigate(`/race-results/${raceId}`);
    } catch (error) {
      console.error("Erro ao salvar resultados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar os resultados. Verifique se você tem permissão.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePoleTimeChange = (value: string) => {
    const formattedTime = formatPoleTime(value);
    setFormData(prev => ({ ...prev, pole_time: formattedTime }));
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
      <div className="container max-w-[1600px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-racing-white">
            Administrar Resultados: {race.name}
          </h1>
          <Button 
            variant="outline"
            onClick={() => navigate("/official-results")}
            className="bg-racing-black border-racing-red text-racing-red hover:bg-racing-red hover:text-racing-white transition-colors"
          >
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <QualifyingResultsForm
              poleTime={formData.pole_time || ""}
              onPoleTimeChange={handlePoleTimeChange}
              qualifyingResults={formData.qualifying_results || []}
              onQualifyingDriverChange={(position, driverId) => {
                const newQualifyingResults = [...(formData.qualifying_results || [])];
                newQualifyingResults[position] = driverId;
                setFormData({ ...formData, qualifying_results: newQualifyingResults });
              }}
              availableDrivers={(position) => getAvailableDrivers(position, true)}
            />

            <div className="space-y-6">
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

              <Card className="bg-racing-black border-racing-silver/20">
                <CardContent className="pt-6">
                  <DNFPredictionForm
                    dnfPredictions={formData.dnf_drivers || []}
                    onDriverDNF={(count) => {
                      const lastDrivers = formData.race_results?.slice(-count) || [];
                      setFormData({ ...formData, dnf_drivers: lastDrivers.filter(d => d !== "placeholder") });
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-racing-red hover:bg-racing-red/90 transition-colors duration-200 min-w-[150px] text-racing-white"
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

