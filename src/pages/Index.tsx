
import { Trophy, Flag, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from 'date-fns-tz';
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Race } from "@/types/betting";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Index = () => {
  const { data: races, isLoading } = useQuery({
    queryKey: ["races"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("races")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      return data as Race[];
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

  const isRacePast = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-racing-black text-racing-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Best Lap
            <span className="text-racing-red"> Bets</span>
          </h1>
          <p className="text-xl md:text-2xl text-racing-silver max-w-2xl mx-auto">
            Compita com amigos, faça previsões para as corridas e suba no ranking
            em nossa experiência premium de apostas F1.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-xl bg-racing-black border border-racing-silver/20 hover:border-racing-red/50 transition-all"
          >
            <Trophy className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-xl font-semibold mb-2">Compita & Vença</h3>
            <p className="text-racing-silver">
              Participe de ligas com amigos e dispute o topo do ranking global.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-xl bg-racing-black border border-racing-silver/20 hover:border-racing-red/50 transition-all"
          >
            <Flag className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-xl font-semibold mb-2">Previsões de Corrida</h3>
            <p className="text-racing-silver">
              Faça previsões detalhadas para cada Grande Prêmio e marque pontos com base na precisão.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 rounded-xl bg-racing-black border border-racing-silver/20 hover:border-racing-red/50 transition-all"
          >
            <Calendar className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-xl font-semibold mb-2">Calendário ao Vivo</h3>
            <p className="text-racing-silver">
              Fique atualizado com o calendário de corridas e prazos para apostas em tempo real.
            </p>
          </motion.div>
        </div>

        {/* Próximas Corridas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Calendário F1 2025</h2>
          {isLoading ? (
            <div className="text-center text-racing-silver">Carregando corridas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {races?.map((race) => {
                const isPast = isRacePast(race.date);
                return (
                  <Card 
                    key={race.id} 
                    className={`bg-racing-black border-racing-silver/20 transition-all ${
                      isPast ? 'opacity-50' : 'hover:border-racing-red/50'
                    }`}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl text-racing-white">
                        {race.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-racing-silver">
                        <p>
                          <strong>Corrida:</strong> {formatDate(race.date)}
                        </p>
                        <p>
                          <strong>Classificação:</strong> {formatDate(race.qualifying_date)}
                        </p>
                        <p>
                          <strong>Circuito:</strong> {race.circuit}
                        </p>
                        <p>
                          <strong>País:</strong> {race.country}
                        </p>
                        {!isPast && (
                          <Link 
                            to={`/predictions/${race.id}`}
                            className="mt-4 w-full px-4 py-2 bg-racing-red text-racing-white rounded-lg font-semibold hover:bg-opacity-90 transition-all block text-center"
                          >
                            Fazer Palpites
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link 
            to="/auth"
            className="inline-block px-8 py-3 bg-racing-red text-racing-white rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105"
          >
            Comece a Apostar Agora
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
