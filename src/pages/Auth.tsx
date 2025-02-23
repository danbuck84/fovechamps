
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Home, Eye, EyeOff } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    const errors = [];
    if (!hasUpperCase) errors.push("uma letra maiúscula");
    if (!hasLowerCase) errors.push("uma letra minúscula");
    if (!hasSpecialChar) errors.push("um caractere especial");
    if (!hasNumber) errors.push("um número");
    if (!hasMinLength) errors.push("no mínimo 8 caracteres");

    return errors;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const passwordErrors = validatePassword(password);
        if (passwordErrors.length > 0) {
          throw new Error(`A senha deve conter ${passwordErrors.join(", ")}`);
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              full_name: email.split("@")[0],
            },
          },
        });
        
        if (error) {
          console.error("Signup error details:", error);
          if (error.message.includes("user_already_exists") || error.message.includes("User already registered")) {
            throw new Error("Este email já está registrado. Por favor, faça login.");
          }
          throw error;
        }

        console.log("Signup successful:", data);
        
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você já pode fazer login com suas credenciais.",
        });
      } else {
        console.log("Attempting login with:", { email }); // omit password for security
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        
        if (error) {
          console.error("Login error details:", error);
          if (error.message.includes("invalid_credentials") || error.message.includes("Invalid login credentials")) {
            throw new Error("Email ou senha incorretos. Por favor, tente novamente.");
          }
          throw error;
        }

        console.log("Login successful:", data);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Erro!",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Lista de requisitos de senha
  const passwordRequirements = [
    { label: "Uma letra maiúscula", regex: /[A-Z]/ },
    { label: "Uma letra minúscula", regex: /[a-z]/ },
    { label: "Um caractere especial", regex: /[!@#$%^&*(),.?":{}|<>]/ },
    { label: "Um número", regex: /[0-9]/ },
    { label: "Mínimo de 8 caracteres", check: (p: string) => p.length >= 8 },
  ];

  return (
    <div className="min-h-screen bg-racing-black flex items-center justify-center p-4">
      <Link
        to="/"
        className="absolute top-4 left-4 text-racing-silver hover:text-racing-red flex items-center gap-2 transition-colors"
      >
        <Home size={20} />
        <span>Voltar para Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-racing-white">
            FoVe<span className="text-racing-red">Champs</span>
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
                onChange={(e) => setEmail(e.target.value.trim())}
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-racing-black border border-racing-silver/20 rounded-md text-racing-white focus:outline-none focus:ring-2 focus:ring-racing-red pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-racing-silver hover:text-racing-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isSignUp && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-racing-silver">Requisitos da senha:</p>
                  <ul className="text-xs space-y-1">
                    {passwordRequirements.map((req, index) => {
                      const isValid = req.regex 
                        ? req.regex.test(password)
                        : req.check!(password);
                      return (
                        <li
                          key={index}
                          className={`flex items-center space-x-2 ${
                            isValid ? "text-green-500" : "text-racing-silver"
                          }`}
                        >
                          <span>{isValid ? "✓" : "○"}</span>
                          <span>{req.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
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
