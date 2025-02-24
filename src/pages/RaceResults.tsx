import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Race, Driver, RaceResult } from "@/types/betting";

const RaceResults = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [qualifyingResults, setQualifyingResults] = useState<string[]>(Array(20).fill(""));
  const [raceResults, setRaceResults] = useState<string[]>(Array(20).fill(""));
  const [dnfDrivers, setDnfDrivers] = useState<string[]>([]);

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
        .select(`
          *,
          team:teams (
            name,
            engine
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data as (Driver & { team: { name: string; engine: string } })[];
    },
  });

  // Buscar resultado existente
  const { data: existingResult } = useQuery({
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

  // Usando useEffect para atualizar o estado quando os dados são carregados
  useEffect(() => {
    if (existingResult) {
      setPoleTime(existingResult.pole_time || "");
      setFastestLap(existingResult.fastest_lap || "");
      setQualifyingResults(existingResult.qualifying_results);
      setRaceResults(existingResult.race_results);
      setDnfDrivers(existingResult.dnf_drivers);
    }
  }, [existingResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para inserir resultados",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const resultData = {
      race_id: raceId,
      qualifying_results: qualifyingResults,
      race_results: raceResults,
      pole_time: poleTime,
      fastest_lap: fastestLap,
      dnf_drivers: dnfDrivers,
    };

    try {
      let result;
      
      if (existingResult?.id) {
        result = await supabase
          .from("race_results")
          .update(resultData)
          .eq("id", existingResult.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("race_results")
          .insert([resultData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      toast({
        title: "Sucesso",
        description: "Resultados salvos com sucesso!",
      });

      // Aqui poderíamos disparar o cálculo das pontuações
      navigate(`/races/${raceId}`);
    } catch (error: any) {
      console.error("Erro ao salvar resultados:", error);
      toast({
        title: "Erro ao salvar resultados",
        description: error.message || "Por favor, tente novamente",
        variant: "destructive",
      });
    }
  };

  if (!race || !drivers) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-2xl">
              Resultados Oficiais - {race.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Tempo da Pole */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Tempo da Pole</h3>
                <Input
                  value={poleTime}
                  onChange={(e) => setPoleTime(e.target.value)}
                  className="bg-racing-black border-racing-silver/20 text-racing-white"
                  placeholder="Ex: 1:23.456"
                />
              </div>

              {/* Grid de Largada */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Grid de Largada</h3>
                {Array(20).fill(0).map((_, index) => (
                  <div key={`qualifying-${index}`} className="flex items-center gap-4">
                    <span className="w-8">{index + 1}.</span>
                    <select
                      value={qualifyingResults[index] || ""}
                      onChange={(e) => {
                        const newResults = [...qualifyingResults];
                        newResults[index] = e.target.value;
                        setQualifyingResults(newResults);
                      }}
                      className="w-full bg-racing-black border border-racing-silver/20 rounded p-2 text-racing-white"
                    >
                      <option value="">Selecione um piloto</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.team.name})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Resultado da Corrida */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Resultado da Corrida</h3>
                {Array(20).fill(0).map((_, index) => (
                  <div key={`race-${index}`} className="flex items-center gap-4">
                    <span className="w-8">{index + 1}.</span>
                    <select
                      value={raceResults[index] || ""}
                      onChange={(e) => {
                        const newResults = [...raceResults];
                        newResults[index] = e.target.value;
                        setRaceResults(newResults);
                      }}
                      className="w-full bg-racing-black border border-racing-silver/20 rounded p-2 text-racing-white"
                    >
                      <option value="">Selecione um piloto</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.team.name})
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Volta Mais Rápida */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Volta Mais Rápida</h3>
                <select
                  value={fastestLap}
                  onChange={(e) => setFastestLap(e.target.value)}
                  className="w-full bg-racing-black border border-racing-silver/20 rounded p-2 text-racing-white"
                >
                  <option value="">Selecione um piloto</option>
                  {drivers?.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.team.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* DNFs */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Abandonos</h3>
                <div className="grid grid-cols-2 gap-4">
                  {drivers.map((driver) => (
                    <label
                      key={driver.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dnfDrivers.includes(driver.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDnfDrivers([...dnfDrivers, driver.id]);
                          } else {
                            setDnfDrivers(dnfDrivers.filter(id => id !== driver.id));
                          }
                        }}
                        className="rounded border-racing-silver/20"
                      />
                      {driver.name}
                    </label>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-racing-red hover:bg-racing-red/90"
              >
                Salvar Resultados
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RaceResults;
