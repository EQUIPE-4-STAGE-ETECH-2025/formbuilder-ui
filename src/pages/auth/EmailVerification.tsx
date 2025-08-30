import { CheckCircle, Loader, Mail, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Footer } from "../../components/layout/Footer";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../hooks/useToast";
import { authService } from "../../services/api/auth/authService";

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "expired"
  >("loading");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [toastShown, setToastShown] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!token || toastShown) return;
  
    let cancelled = false;
  
    const verify = async () => {
      try {
        const res = await authService.verifyEmail(token);
  
        if (cancelled) return;
  
        if (res.success) {
          setStatus("success");
          if (!toastShown) {
            addToast({
              type: "success",
              title: "Email vérifié",
              message: "Votre compte est activé !",
            });
            setToastShown(true);
          }
        } else {
          setStatus(res.message?.includes("expiré") ? "expired" : "error");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    };
  
    verify();
  
    return () => {
      cancelled = true;
    };
  }, [token, addToast, toastShown]);
   


  const resendVerification = async () => {
    setLoading(true);
    const res = await authService.resendVerification(email);
    if (!('error' in res)) {
      addToast({
        type: "success",
        title: "Email envoyé",
        message: res.message || "Un nouveau lien de vérification a été envoyé."
      });
    } else {
      addToast({
        type: "error",
        title: "Erreur",
        message: res.error || "Impossible d'envoyer l'email."
      });
    }
    setLoading(false);
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="mx-auto w-16 h-16 loading-blur rounded-2xl flex items-center justify-center">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Vérification en cours...
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Nous vérifions votre adresse email
            </p>
          </>
        );

      case "success":
        return (
          <>
            <div className="mx-auto w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Email vérifié !
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Votre compte a été activé avec succès
            </p>
          </>
        );

      case "expired":
        return (
          <>
            <div className="mx-auto w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Lien expiré
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Ce lien de vérification a expiré
            </p>
          </>
        );

      case "error":
      default:
        return (
          <>
            <div className="mx-auto w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center">
              <XCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-text-100">
              Erreur de vérification
            </h2>
            <p className="mt-2 text-sm text-surface-400">
              Le lien de vérification est invalide ou a expiré
            </p>
          </>
        );
    }
  };

  const renderActions = () => {
    switch (status) {
      case "success":
        return (
          <Link to="/login">
            <Button className="w-full mt-2" size="lg" variant="accent">
              Se connecter
            </Button>
          </Link>
        );

      case "expired":
      case "error":
        return (
          <div className="space-y-3 g-2">
            <Button
              onClick={resendVerification}
              loading={loading}
              className="w-full"
              size="lg"
              variant="accent"
            >
              Renvoyer l'email de vérification
            </Button>
            <Link to="/register">
              <Button variant="secondary" className="w-full my-6">
                Créer un nouveau compte
              </Button>
            </Link>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">{renderContent()}</div>

          <div className="bg-surface-900 border border-surface-700/50 rounded-2xl p-8">
            <div className="text-center space-y-4">
              {email && (
                <p className="text-sm text-surface-400">
                  Email:{" "}
                  <span className="font-medium text-text-100">{email}</span>
                </p>
              )}
              {renderActions()}

              {status !== "loading" && (
                <Link
                  to="/login"
                  className="text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors duration-200"
                >
                  Retour à la connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
