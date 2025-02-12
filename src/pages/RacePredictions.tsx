
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Race } from "@/types/betting";

const RacePredictions = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [polePosition, setPolePosition] = useState("");
  const [poleTime, setPoleTime] = useState("");
  const [fastestLap, setFastestLap] = useState("");
  const [top10, setTop10] = useState<string[]>(Array(10).fill(""));

  const { data: race, isLoading } = useQuery({
    queryKey: ["race", raceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .eq("id", raceId)
        .single();

      if (error) throw error;
      return data as Race;
    },
  });

  const formatDate = (date: string) => {
    return formatInTimeZone(
      new Date(date),
      'America/Sao_Paulo',
      "d 'de' MMMM 'às' HH:mm",
      { locale: ptBR }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer palpites",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase.from("predictions").insert({
      race_id: raceId,
      user_id: user.data.user.id,
      pole_position: polePosition,
      pole_time: poleTime,
      fastest_lap: fastestLap,
      top_10: top10,
    });

    if (error) {
      toast({
        title: "Erro ao salvar palpites",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Palpites salvos com sucesso!",
      description: "Boa sorte!",
    });

    navigate("/");
  };

  if (isLoading || !race) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando informações da corrida...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="text-racing-silver hover:text-racing-white mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Card className="bg-racing-black border-racing-silver/20">
          <CardHeader>
            <CardTitle className="text-2xl text-racing-white">
              {race.name}
            </CardTitle>
            <p className="text-racing-silver">
              Data da corrida: {formatDate(race.date)}
            </p>
            <p className="text-racing-silver">
              Classificação: {formatDate(race.qualifying_date)}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Classificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="polePosition" className="text-sm text-racing-silver">
                      Pole Position
                    </label>
                    <Input
                      id="polePosition"
                      value={polePosition}
                      onChange={(e) => setPolePosition(e.target.value)}
                      className="bg-racing-black border-racing-silver/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="poleTime" className="text-sm text-racing-silver">
                      Tempo da Pole (formato: 1:23.456)
                    </label>
                    <Input
                      id="poleTime"
                      value={poleTime}
                      onChange={(e) => setPoleTime(e.target.value)}
                      className="bg-racing-black border-racing-silver/20"
                      placeholder="1:23.456"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Corrida</h3>
                <div className="space-y-2">
                  <label htmlFor="fastestLap" className="text-sm text-racing-silver">
                    Volta mais rápida
                  </label>
                  <Input
                    id="fastestLap"
                    value={fastestLap}
                    onChange={(e) => setFastestLap(e.target.value)}
                    className="bg-racing-black border-racing-silver/20"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Top 10 - Ordem de chegada</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {top10.map((driver, index) => (
                      <div key={index} className="space-y-2">
                        <label htmlFor={`position-${index + 1}`} className="text-sm text-racing-silver">
                          {index + 1}º Lugar
                        </label>
                        <Input
                          id={`position-${index + 1}`}
                          value={driver}
                          onChange={(e) => {
                            const newTop10 = [...top10];
                            newTop10[index] = e.target.value;
                            setTop10(newTop10);
                          }}
                          className="bg-racing-black border-racing-silver/20"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-racing-red hover:bg-opacity-90"
              >
                Salvar Palpites
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RacePredictions;
