
import { useOpenF1TableData } from "@/hooks/useOpenF1TableData";
import { PointsTable } from "@/components/tables/PointsTable";
import MainLayout from "@/components/layout/MainLayout";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Tables = () => {
  const [selectedSeason, setSelectedSeason] = useState<number>(2024); // Start with 2024 since we have data for it
  const [retryCount, setRetryCount] = useState(0);
  const { races, driversStandings, teamsStandings, loading, error, currentSeason } = useOpenF1TableData(selectedSeason);
  const isMobile = useIsMobile();
  
  // Add a timeout to detect if the page is taking too long to load
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    if (loading) {
      timeoutId = setTimeout(() => {
        toast.warning("O carregamento está demorando mais que o esperado", {
          description: "Talvez haja um problema com a API externa."
        });
      }, 10000); // 10 seconds timeout
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading, selectedSeason]);
  
  const handleRetry = () => {
    // Force re-fetch by incrementing retry count
    setRetryCount(prev => prev + 1);
    toast.info("Tentando carregar os dados novamente...");
    
    // Delay the season change slightly to ensure React Query refetches
    setTimeout(() => {
      // Toggle season back and forth to force a refetch
      setSelectedSeason(prev => prev === 2024 ? 2023 : 2024);
      setTimeout(() => setSelectedSeason(currentSeason), 100);
    }, 100);
  };
  
  // Show user-friendly error state
  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
          <div className="flex flex-col items-center text-center max-w-md px-4">
            <AlertCircle className="h-10 w-10 text-racing-red mb-4" />
            <h2 className="text-xl font-bold mb-2">Não foi possível carregar os dados</h2>
            <p className="text-racing-silver mb-4">
              Ocorreu um erro ao carregar os dados da temporada {selectedSeason}.
              Isto pode ser um problema temporário com a API externa.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                className="bg-racing-red hover:bg-racing-red/80 text-racing-white border-none"
              >
                Tentar novamente
              </Button>
              <Button 
                onClick={() => setSelectedSeason(selectedSeason === 2024 ? 2023 : 2024)} 
                variant="outline" 
                className="bg-racing-black hover:bg-racing-black/80 text-racing-white border border-racing-silver/50"
              >
                Tentar outra temporada
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Show user-friendly loading state
  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-racing-black text-racing-white flex items-center justify-center">
          <div className="flex flex-col items-center text-center px-4">
            <Loader2 className="h-10 w-10 text-racing-red animate-spin mb-4" />
            <h2 className="text-xl font-bold mb-2">Carregando dados</h2>
            <p className="text-racing-silver">
              Carregando dados da temporada {selectedSeason}...
              <br />
              {retryCount > 0 && "Tentativa " + (retryCount + 1)}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-racing-black text-racing-white p-4 md:p-6">
        <div className={`max-w-5xl mx-auto ${isMobile ? 'px-2' : ''}`}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-center md:text-left">
              Tabelas de Classificação
            </h1>
            
            <div className="w-full md:w-auto">
              <Select
                value={selectedSeason.toString()}
                onValueChange={(value) => setSelectedSeason(parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-[180px] bg-racing-black text-racing-white border-racing-silver/20">
                  <SelectValue placeholder="Selecione a temporada" />
                </SelectTrigger>
                <SelectContent className="bg-racing-black text-racing-white border-racing-silver/20">
                  <SelectItem value="2024" className="hover:bg-racing-white/10">2024</SelectItem>
                  <SelectItem value="2023" className="hover:bg-racing-white/10">2023</SelectItem>
                  <SelectItem value="2022" className="hover:bg-racing-white/10">2022</SelectItem>
                  <SelectItem value="2021" className="hover:bg-racing-white/10">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mx-auto overflow-x-auto">
            {/* Verificar se temos dados para exibir */}
            {races.length === 0 && !loading && (
              <div className="text-center p-6 bg-racing-black/50 rounded-lg border border-racing-silver/20">
                <AlertCircle className="h-6 w-6 text-racing-red mb-2 mx-auto" />
                <p className="text-racing-silver">
                  Nenhuma corrida encontrada para a temporada {selectedSeason}.
                </p>
                <Button 
                  onClick={() => setSelectedSeason(selectedSeason === 2024 ? 2023 : 2024)} 
                  variant="outline" 
                  className="mt-4 bg-racing-black hover:bg-racing-black/80 text-racing-white border border-racing-silver/50"
                >
                  Tentar outra temporada
                </Button>
              </div>
            )}
            
            {/* Tabela de Pilotos */}
            {races.length > 0 && (
              <PointsTable 
                title="Campeonato de Pilotos"
                data={driversStandings || []}
                races={races || []}
                getName={(driver) => `${driver?.name || 'Desconhecido'}`}
                getPoints={(driver, raceId) => driver?.points?.[raceId] || 0}
                isDrivers={true}
                getNationality={(driver) => driver?.nationality || "N/A"}
                getTeam={(driver) => driver?.team_name || ""}
              />
            )}
            
            {/* Tabela de Construtores */}
            {races.length > 0 && (
              <PointsTable 
                title="Campeonato de Construtores"
                data={teamsStandings || []}
                races={races || []}
                getName={(team) => `${team?.name || 'Desconhecido'}`}
                getPoints={(team, raceId) => team?.points?.[raceId] || 0}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Tables;
