
import { Trophy, Flag, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
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
            Formula One
            <span className="text-racing-red"> Betting League</span>
          </h1>
          <p className="text-xl md:text-2xl text-racing-silver max-w-2xl mx-auto">
            Compete with friends, predict race outcomes, and climb the leaderboard
            in our premium F1 betting experience.
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
            <h3 className="text-xl font-semibold mb-2">Compete & Win</h3>
            <p className="text-racing-silver">
              Join leagues with friends and compete for the top spot on our global
              leaderboard.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-6 rounded-xl bg-racing-black border border-racing-silver/20 hover:border-racing-red/50 transition-all"
          >
            <Flag className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-xl font-semibold mb-2">Race Predictions</h3>
            <p className="text-racing-silver">
              Make detailed predictions for each Grand Prix and score points based
              on accuracy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="p-6 rounded-xl bg-racing-black border border-racing-silver/20 hover:border-racing-red/50 transition-all"
          >
            <Calendar className="w-12 h-12 text-racing-red mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Schedule</h3>
            <p className="text-racing-silver">
              Stay updated with real-time race schedules and betting deadlines.
            </p>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-racing-red text-racing-white rounded-lg font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
            Start Betting Now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
