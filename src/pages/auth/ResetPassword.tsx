import { CheckCircle, Eye, EyeOff, Lock, XCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { authService } from "../../services/api";

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState<"form" | "success" | "error">("form");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordForm>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ResetPasswordForm) => {
    setLoading(true);
    const res = await authService.resetPassword(token, data.newPassword);
    if (res.success) {
      setStatus("success");
      addToast({
        type: "success",
        title: "Mot de passe réinitialisé",
        message:
          "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
      });
    } else {
      setStatus("error");
      addToast({
        type: "error",
        title: "Erreur",
        message: res.message || "Impossible de réinitialiser le mot de passe",
      });
    }
    setLoading(false);
  };

  const resendReset = async () => {
    setLoading(true);
    const res = await authService.forgotPassword(email);
    if (res.success) {
      addToast({
        type: "success",
        title: "Email envoyé",
        message: "Un nouveau lien de réinitialisation a été envoyé.",
      });
    } else {
      addToast({
        type: "error",
        title: "Erreur",
        message: res.message,
      });
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (status) {
      case "form":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden">
                <img
                  src="/src/assets/images/logo/formbuilder-logo.png"
                  alt="FormBuilder"
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-text-100">
                Réinitialiser le mot de passe
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                Entrez votre nouveau mot de passe pour l’email :{" "}
                <span className="font-medium text-text-100">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
              {/* Nouveau mot de passe */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-text-100 mb-2 text-left"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-surface-500" />
                  </div>
                  <input
                    {...register("newPassword", {
                      required: "Mot de passe requis",
                      minLength: {
                        value: 8,
                        message:
                          "Le mot de passe doit faire au moins 8 caractères",
                      },
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
                        message:
                          "Le mot de passe doit contenir une majuscule, un chiffre et un caractère spécial",
                      },
                    })}
                    type={showPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="Votre nouveau mot de passe"
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
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-yellow-400">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmer le mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-100 mb-2 text-left"
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
                        value === newPassword ||
                        "Les mots de passe ne correspondent pas",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="block w-full pl-10 pr-10 py-3 border border-surface-700/50 rounded-xl bg-surface-900 text-surface-400 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent focus:ring-offset-2 focus:ring-offset-background-950 transition-all duration-200"
                    placeholder="Confirmez votre mot de passe"
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
                Réinitialiser le mot de passe
              </Button>
            </form>
          </>
        );

      case "success":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-text-100">
                Mot de passe réinitialisé !
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                Vous pouvez maintenant vous connecter avec votre nouveau mot de
                passe.
              </p>
              <Link to="/login">
                <Button className="w-full mt-6" size="lg" variant="accent">
                  Se connecter
                </Button>
              </Link>
            </div>
          </>
        );

      case "error":
        return (
          <>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
                <XCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-text-100">
                Lien invalide ou expiré
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                Le lien de réinitialisation est invalide ou a expiré.
              </p>
              {email && (
                <Button
                  onClick={resendReset}
                  loading={loading}
                  className="w-full mt-6"
                  size="lg"
                  variant="accent"
                >
                  Renvoyer le lien
                </Button>
              )}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
}
