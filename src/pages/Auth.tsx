
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          // Verifica o código de erro específico para usuário já registrado
          if (error.message.includes("user_already_exists") || error.message.includes("User already registered")) {
            throw new Error("Este email já está registrado. Por favor, faça login.");
          }
          throw error;
        }
        
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar seu cadastro.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          // Verifica o código de erro específico para credenciais inválidas
          if (error.message.includes("invalid_credentials") || error.message.includes("Invalid login credentials")) {
            throw new Error("Email ou senha incorretos. Por favor, tente novamente.");
          }
          throw error;
        }
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error); // Adicionando log para debug
      toast({
        title: "Erro!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-racing-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-racing-white">
            Bestap<span className="text-racing-red">Bets</span>
          </h2>
          <p className="mt-2 text-racing-silver">
            {isSignUp
              ? "Crie sua conta para começar a apostar"
              : "Entre com sua conta para continuar"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-racing-silver"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-racing-black border border-racing-silver/20 rounded-md text-racing-white focus:outline-none focus:ring-2 focus:ring-racing-red"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-racing-silver"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-racing-black border border-racing-silver/20 rounded-md text-racing-white focus:outline-none focus:ring-2 focus:ring-racing-red"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-racing-red hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-racing-red disabled:opacity-50"
            >
              {loading
                ? "Carregando..."
                : isSignUp
                ? "Criar conta"
                : "Entrar"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-racing-silver hover:text-racing-red"
          >
            {isSignUp
              ? "Já tem uma conta? Entre aqui"
              : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
