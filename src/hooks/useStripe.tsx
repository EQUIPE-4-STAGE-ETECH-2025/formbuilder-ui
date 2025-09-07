import { useState } from "react";
import { stripeService } from "../services/api/subscriptions/subscriptionsService";
import { ICheckoutSessionRequest } from "../services/api/subscriptions/subscriptionsTypes";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

interface IUseStripeReturn {
  // États
  loading: boolean;

  // Méthodes principales
  subscribeToPlan: (priceId: string) => Promise<void>;
  openCustomerPortal: () => Promise<void>;

  // Méthodes de récupération
  checkCheckoutSessionStatus: (sessionId: string) => Promise<boolean>;
}

export const useStripe = (): IUseStripeReturn => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  // S'abonner à un plan via Stripe Checkout
  const subscribeToPlan = async (priceId: string): Promise<void> => {
    if (!user) {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Vous devez être connecté pour vous abonner",
      });
      return;
    }

    setLoading(true);

    try {
      const checkoutRequest: ICheckoutSessionRequest = {
        price_id: priceId,
        success_url: `${window.location.origin}/subscription`,
        cancel_url: `${window.location.origin}/subscription?canceled=true`,
        quantity: 1,
        mode: "subscription" as const,
      };

      const response = await stripeService.createCheckoutSession(
        checkoutRequest
      );

      if (response.success && response.data) {
        // Rediriger vers Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error(
          response.error || "Erreur lors de la création de la session"
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      addToast({
        type: "error",
        title: "Erreur de paiement",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir le portail client Stripe
  const openCustomerPortal = async (): Promise<void> => {
    if (!user) {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Vous devez être connecté pour accéder au portail",
      });
      return;
    }

    setLoading(true);

    try {
      // Récupérer l'URL du portail client depuis les variables d'environnement
      const portalUrl = import.meta.env.VITE_STRIPE_CUSTOMER_PORTAL_URL;

      if (!portalUrl) {
        throw new Error("URL du portail client Stripe non configurée");
      }

      // Construire l'URL complète avec l'email de l'utilisateur (optionnel mais améliore l'UX)
      const url = new URL(portalUrl);
      url.searchParams.set("prefilled_email", user.email);

      // Rediriger directement vers le portail client Stripe
      window.location.href = url.toString();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur inconnue";
      addToast({
        type: "error",
        title: "Erreur",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier le statut d'une session de checkout après retour
  const checkCheckoutSessionStatus = async (
    sessionId: string
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const response = await stripeService.getCheckoutSessionStatus(sessionId);

      if (response.success && response.data) {
        const { session } = response.data;

        if (
          session.payment_status === "paid" &&
          session.status === "complete"
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        throw new Error(response.error || "Erreur lors de la vérification");
      }
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    subscribeToPlan,
    openCustomerPortal,
    checkCheckoutSessionStatus,
  };
};
