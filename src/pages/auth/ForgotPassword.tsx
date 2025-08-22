import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { authService } from "../../services/api";

interface ForgotPasswordForm {
  email: string;
}

export function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    setLoading(true);
    try {
      const res = await authService.forgotPassword(data.email);

      if (res.success) {
        setEmailSent(true);
        addToast({
          type: "success",
          title: "Email envoyé",
          message:
            "Vérifiez votre boîte mail pour réinitialiser votre mot de passe",
        });
      } else {
        addToast({
          type: "error",
          title: "Erreur",
          message: res.error || "Impossible d'envoyer l'email",
        });
      }
    } catch {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Une erreur est survenue, veuillez réessayer",
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-text-100">
                Email envoyé !
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                Nous avons envoyé un lien de réinitialisation à{" "}
                <span className="font-medium text-text-100">
                  {getValues("email")}
                </span>
              </p>
            </div>

            <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-8">
              <div className="text-center space-y-4">
                <p className="text-surface-400 pb-8">
                  Cliquez sur le lien dans l'email pour créer un nouveau mot de
                  passe. Si vous ne voyez pas l'email, vérifiez votre dossier
                  spam.
                </p>
                <Link to="/login">
                  <Button variant="secondary" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-accent-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Mot de passe oublié ?
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Entrez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
                variant="accent"
              >
                Envoyer le lien de réinitialisation
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 inline mr-1" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
