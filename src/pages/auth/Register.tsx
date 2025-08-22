import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

interface RegisterForm {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading, error, clearError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    clearError();

    const success = await registerUser({
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      password: data.password,
    });

    if (success) {
      addToast({
        type: "success",
        title: "Inscription réussie",
        message: "Vérifiez votre email pour confirmer votre compte",
      });
      navigate("/login");
    } else {
      addToast({
        type: "error",
        title: "Erreur d'inscription",
        message: error || "Une erreur est survenue",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Créer votre compte
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Ou{" "}
              <Link
                to="/login"
                className="text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200"
              >
                connectez-vous à votre compte existant
              </Link>
            </p>
          </div>

          <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-text-100 mb-2"
                  >
                    Prénom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-surface-500" />
                    </div>
                    <input
                      {...register("first_name", {
                        required: "Le prénom est requis",
                      })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                      placeholder="Anna"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-yellow-400">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-text-100 mb-2"
                  >
                    Nom
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-surface-500" />
                    </div>
                    <input
                      {...register("last_name", {
                        required: "Le nom est requis",
                      })}
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                      placeholder="Martin"
                    />
                  </div>
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-yellow-400">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

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
                    {...register("email", {
                      required: "L'email est requis",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Email invalide",
                      },
                    })}
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-yellow-400">
                    {errors.email.message}
                  </p>
                )}
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
                    {...register('password', {
                      required: 'Mot de passe requis',
                      minLength: {
                        value: 8,
                        message: 'Le mot de passe doit faire au moins 8 caractères',
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                        message: 'Le mot de passe doit contenir une majuscule, un chiffre et un caractère spécial',
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="••••••••"
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
                {errors.password && (
                  <p className="mt-1 text-sm text-yellow-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-100 mb-2"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    {...register("confirmPassword", {
                      required: "La confirmation du mot de passe est requise",
                      validate: (value) =>
                        value === password ||
                        "Les mots de passe ne correspondent pas",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-300 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-yellow-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                variant="accent"
              >
                Créer mon compte
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
