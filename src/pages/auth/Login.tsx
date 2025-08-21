import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading, clearError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const result = await login(email, password);

    if (result.success && result.data) {
      navigate("/dashboard");
    } else {
      addToast({
        type: "error",
        title: "Erreur de connexion",
        message: result.error === "Email non vérifié."
            ? "Veuillez vérifier votre email avant de vous connecter."
            : result.error || "Identifiants invalides",
    });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">Connexion</h2>
            <p className="mt-2 text-sm text-surface-400">
              Ou{" "}
              <Link
                to="/register"
                className="text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200"
              >
                créez votre compte gratuitement
              </Link>
            </p>
          </div>

          <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-100 mb-2"
                >
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text-100 mb-2"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-300 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-surface-700/50 rounded bg-surface-900 text-accent-500 focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200 checked:bg-accent-500 checked:border-accent-500"
                    style={{
                      backgroundImage: rememberMe
                        ? "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11.207 5.793a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 8.586l3.293-3.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
                        : "none",
                      backgroundSize: "12px",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
                  <span className="ml-2 text-sm text-surface-400">
                    Se souvenir de moi
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                variant="accent"
              >
                Se connecter
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
