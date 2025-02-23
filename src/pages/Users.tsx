
import { Construction } from "lucide-react";
import { motion } from "framer-motion";

const Users = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <Construction className="w-16 h-16 text-racing-red mx-auto" />
        <h1 className="text-3xl font-bold text-racing-white">Página em Construção</h1>
        <p className="text-racing-silver max-w-md">
          Em breve você poderá ver todos os participantes e seus históricos de apostas aqui.
        </p>
      </motion.div>
    </div>
  );
};

export default Users;
