
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

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("Este email já está registrado. Por favor, faça login.");
          }
          throw error;
        }

        if (data?.user) {
          toast({
            title: "Conta criada com sucesso!",
            description: "Você já pode fazer login com suas credenciais.",
          });
          setIsSignUp(false);
          // Limpa os campos após criar a conta
          setEmail("");
          setPassword("");
        }
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

        if (data.user) {
          toast({
            title: "Bem-vindo!",
            description: "Login realizado com sucesso.",
          });
          navigate("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Erro!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        title: "Digite seu email",
        description: "Por favor, insira seu email para receber o link de recuperação de senha.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) throw error;

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para recuperar sua senha.",
      });
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

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Limpa os campos ao alternar entre modos
    setEmail("");
    setPassword("");
    setShowPassword(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-racing-black">
      {/* Logo */}
      <div className="mb-8">
        <button 
          onClick={() => navigate("/")}
          className="text-3xl font-bold text-racing-white hover:opacity-80 transition-opacity"
        >
          FoVe
          <span className="text-racing-red">Champs</span>
        </button>
      </div>

      <Card className="w-full max-w-md p-8 space-y-6 bg-racing-black border-racing-silver/20">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-racing-white">
            {isSignUp ? "Criar Conta" : "Login"}
          </h1>
          <p className="text-racing-silver">
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
              className="w-full bg-[#333] text-racing-white border-racing-silver/20 placeholder:text-racing-silver"
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
              className="w-full bg-[#333] text-racing-white border-racing-silver/20 placeholder:text-racing-silver pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-racing-silver hover:text-racing-white hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-racing-red hover:bg-racing-red/90 text-racing-white"
            disabled={isLoading}
          >
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>
        <div className="text-center space-y-2">
          <Button
            variant="link"
            onClick={toggleMode}
            className="text-sm text-racing-red hover:text-racing-red/90"
            disabled={isLoading}
          >
            {isSignUp
              ? "Já tem uma conta? Faça login"
              : "Não tem uma conta? Cadastre-se"}
          </Button>
          {!isSignUp && (
            <Button
              variant="link"
              onClick={handleResetPassword}
              className="text-sm text-racing-silver hover:text-racing-white block mx-auto"
              disabled={isLoading}
            >
              Esqueci minha senha
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
