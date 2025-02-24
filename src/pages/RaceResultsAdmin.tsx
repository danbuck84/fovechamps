
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
        .select("*");
      
      if (error) throw error;
      return data as Driver[];
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

  const [formData, setFormData] = useState<Partial<RaceResult>>({
    qualifying_results: existingResult?.qualifying_results || [],
    race_results: existingResult?.race_results || [],
    pole_time: existingResult?.pole_time || "",
    fastest_lap: existingResult?.fastest_lap || "",
    dnf_drivers: existingResult?.dnf_drivers || [],
  });

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-racing-silver mb-2">
                  Tempo da Pole
                </label>
                <Input
                  type="text"
                  value={formData.pole_time || ""}
                  onChange={(e) => setFormData({ ...formData, pole_time: e.target.value })}
                  placeholder="ex: 1:23.456"
                  className="bg-racing-black border-racing-silver/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle>Resultados da Corrida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {driver.name}
                    </option>
                  ))}
                </select>
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
