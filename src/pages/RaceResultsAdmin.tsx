
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import type { Race, Driver, RaceResult } from "@/types/betting";

const RaceResultsAdmin = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Buscar dados da corrida
  const { data: race } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      if (!raceId) throw new Error("Race ID não fornecido");
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();
      
      if (error) throw error;
      return data as Race;
    },
  });

  // Buscar lista de pilotos
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drivers")
        .select("*, team:teams(name, engine)");
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Buscar resultados existentes
  const { data: existingResult, refetch } = useQuery({
    queryKey: ["raceResult", raceId],
    queryFn: async () => {
      if (!raceId) return null;
      const { data, error } = await supabase
        .from("race_results")
        .select("*")
        .eq("race_id", raceId)
        .maybeSingle();
      
      if (error) throw error;
      return data as RaceResult | null;
    },
  });

  // Estado para grids e DNFs
  const [formData, setFormData] = useState<Partial<RaceResult>>({
    qualifying_results: existingResult?.qualifying_results || Array(20).fill(""),
    race_results: existingResult?.race_results || Array(20).fill(""),
    pole_time: existingResult?.pole_time || "",
    fastest_lap: existingResult?.fastest_lap || "",
    dnf_drivers: existingResult?.dnf_drivers || [],
  });

  // Atualizar piloto na grid de largada
  const handleQualifyingDriverChange = (position: number, driverId: string) => {
    const newQualifyingResults = [...formData.qualifying_results || []];
    newQualifyingResults[position] = driverId;
    setFormData({ ...formData, qualifying_results: newQualifyingResults });
  };

  // Atualizar piloto na grid de chegada
  const handleRaceDriverChange = (position: number, driverId: string) => {
    const newRaceResults = [...formData.race_results || []];
    newRaceResults[position] = driverId;
    setFormData({ ...formData, race_results: newRaceResults });
  };

  // Atualizar DNF de um piloto
  const handleDNFChange = (driverId: string, checked: boolean) => {
    const currentDNFs = [...(formData.dnf_drivers || [])];
    if (checked && !currentDNFs.includes(driverId)) {
      setFormData({ ...formData, dnf_drivers: [...currentDNFs, driverId] });
    } else if (!checked) {
      setFormData({
        ...formData,
        dnf_drivers: currentDNFs.filter(id => id !== driverId)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultData = {
        ...formData,
        race_id: raceId,
      };

      if (existingResult) {
        const { error } = await supabase
          .from("race_results")
          .update(resultData)
          .eq("id", existingResult.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("race_results")
          .insert([resultData]);

        if (error) throw error;
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
        description: "Não foi possível salvar os resultados.",
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

  const getAvailableDrivers = (position: number, isQualifying: boolean) => {
    if (!drivers) return [];
    const selectedPositions = isQualifying 
      ? formData.qualifying_results 
      : formData.race_results;
    
    return drivers.filter(driver => {
      const isSelected = selectedPositions?.includes(driver.id);
      return !isSelected || selectedPositions[position] === driver.id;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-racing-white">
          Administrar Resultados: {race.name}
        </h1>
        <Button 
          variant="outline"
          onClick={() => navigate(-1)}
          className="border-racing-silver/20"
        >
          Voltar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Resultados da Classificação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-racing-silver mb-2">
                  Tempo da Pole
                </label>
                <input
                  type="text"
                  value={formData.pole_time || ""}
                  onChange={(e) => setFormData({ ...formData, pole_time: e.target.value })}
                  placeholder="ex: 1:23.456"
                  className="w-full bg-racing-black border border-racing-silver/20 rounded-md p-2"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-racing-silver">
                  Grid de Largada
                </label>
                {Array.from({ length: 20 }).map((_, index) => (
                  <div key={`qualifying-${index}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <select
                      value={formData.qualifying_results?.[index] || ""}
                      onChange={(e) => handleQualifyingDriverChange(index, e.target.value)}
                      className="flex-1 bg-racing-black border border-racing-silver/20 rounded-md p-2"
                    >
                      <option value="">Selecione um piloto</option>
                      {getAvailableDrivers(index, true).map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Resultados da Corrida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-racing-silver mb-2">
                  Volta Mais Rápida
                </label>
                <select
                  value={formData.fastest_lap || ""}
                  onChange={(e) => setFormData({ ...formData, fastest_lap: e.target.value })}
                  className="w-full bg-racing-black border border-racing-silver/20 rounded-md p-2"
                >
                  <option value="">Selecione um piloto</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.team.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-racing-silver">
                  Grid de Chegada
                </label>
                {Array.from({ length: 20 }).map((_, index) => (
                  <div key={`race-${index}`} className="flex items-center gap-2">
                    <span className="w-8 text-racing-silver">{index + 1}.</span>
                    <select
                      value={formData.race_results?.[index] || ""}
                      onChange={(e) => handleRaceDriverChange(index, e.target.value)}
                      className="flex-1 bg-racing-black border border-racing-silver/20 rounded-md p-2"
                    >
                      <option value="">Selecione um piloto</option>
                      {getAvailableDrivers(index, false).map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} - {driver.team.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`dnf-${index}`}
                        checked={formData.dnf_drivers?.includes(formData.race_results?.[index] || "")}
                        onCheckedChange={(checked) => {
                          const driverId = formData.race_results?.[index];
                          if (driverId) {
                            handleDNFChange(driverId, checked as boolean);
                          }
                        }}
                        disabled={!formData.race_results?.[index]}
                      />
                      <label
                        htmlFor={`dnf-${index}`}
                        className="text-sm font-medium text-racing-silver leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        DNF
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-racing-red hover:bg-racing-red/90"
          >
            {loading ? "Salvando..." : "Salvar Resultados"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RaceResultsAdmin;
