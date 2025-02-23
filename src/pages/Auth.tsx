
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        toast({
          title: "Sucesso!",
          description: "Você já pode fazer login com suas credenciais.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.");
          }
          throw error;
        }

        toast({
          title: "Bem-vindo!",
          description: "Login realizado com sucesso.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#000000e6]">
      <Card className="w-full max-w-md p-8 space-y-6 bg-[#222] border-racing-red">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">
            {isSignUp ? "Criar Conta" : "Login"}
          </h1>
          <p className="text-[#fff6]">
            {isSignUp 
              ? "Crie sua conta para começar a fazer suas previsões" 
              : "Entre com suas credenciais para continuar"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#333] text-white border-racing-red placeholder:text-[#fff6]"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#333] text-white border-racing-red placeholder:text-[#fff6] pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#fff6] hover:text-white hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-racing-red hover:bg-racing-red/90 text-white"
            disabled={isLoading}
          >
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-racing-red hover:text-racing-red/90"
            disabled={isLoading}
          >
            {isSignUp
              ? "Já tem uma conta? Faça login"
              : "Não tem uma conta? Cadastre-se"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
