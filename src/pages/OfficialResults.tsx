
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Eye, BarChart2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Race } from "@/types/betting";

interface RaceWithResults extends Race {
  race_results: { id: string; } | null;
}

const OfficialResults = () => {
  const { isAdmin } = useAdmin();
  const { data: races, isLoading } = useQuery({
    queryKey: ["races-with-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select(`
          *,
          race_results(id)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as RaceWithResults[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
        <p className="text-racing-silver">Carregando corridas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-racing-black text-racing-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resultados Oficiais</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {races?.map((race) => (
            <Card key={race.id} className="bg-racing-black border-racing-silver/20">
              <CardHeader>
                <CardTitle className="text-xl text-racing-white">
                  {race.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-racing-silver">
                    Data da corrida: {new Date(race.date).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-racing-silver">
                    Circuito: {race.circuit}
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    {isAdmin && (
                      <Link to={`/admin/race-results/${race.id}`}>
                        <Button 
                          variant="outline" 
                          className="w-full border-racing-red text-racing-red hover:bg-racing-red hover:text-racing-white"
                        >
                          <Edit className="w-4 h-4" />
                          Editar Resultados
                        </Button>
                      </Link>
                    )}
                    {race.race_results ? (
                      <>
                        <Link to={`/race-results-view/${race.id}`}>
                          <Button 
                            variant="outline" 
                            className="w-full border-racing-red text-racing-red hover:bg-racing-red hover:text-racing-white"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Resultados
                          </Button>
                        </Link>
                        <Link to={`/tables`}>
                          <Button 
                            variant="outline"
                            className="w-full border-racing-red text-racing-red hover:bg-racing-red hover:text-racing-white"
                          >
                            <BarChart2 className="w-4 h-4" />
                            Ver Pontuação
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <p className="text-racing-red italic">
                        Resultados ainda não disponíveis
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfficialResults;

