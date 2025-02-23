
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        console.log("Attempting login with email:", email); 
        
        // Primeiro, vamos verificar se o usuário existe
        const { data: existingUser, error: fetchError } = await supabase
          .from('profiles')
          .select()
          .eq('username', email.split('@')[0])
          .single();
        
        console.log("Existing user check:", { existingUser, fetchError });

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        if (error) {
          console.error("Login error details:", error);
          console.error("Login error message:", error.message);
          console.error("Login error status:", error.status);
          
          if (error.message === "Invalid login credentials" || 
              error.message.includes("invalid_credentials")) {
            throw new Error("Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.");
          }
          throw error;
        }

        console.log("Login successful, user data:", data);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error details:", {
        message: error.message,
        status: error.status,
        name: error.name,
        stack: error.stack
      });
      
      toast({
        title: "Erro!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignUp ? "Criar Conta" : "Login"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            {isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary"
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
