import apiClient from "../config/apiClient";
import { withErrorHandling } from "../utils/apiUtils";
import {
  ICancelSubscriptionRequest,
  ICancelSubscriptionResponse,
  ICheckoutSessionRequest,
  ICheckoutSessionResponse,
  ICheckoutSessionStatus,
  ICreateFreeSubscriptionRequest,
  ICreateSubscriptionRequest,
  ICreateSubscriptionResponse,
  ICustomerPortalRequest,
  ICustomerPortalResponse,
  IInvoicesResponse,
  IStripePlan,
  IStripeProductsResponse,
  IStripeSubscription,
  IUpdateSubscriptionRequest,
  TStripeApiResponse,
} from "./subscriptionsTypes";

// Service des plans
export const plansService = {
  // Récupérer tous les plans disponibles
  async getAll(): Promise<TStripeApiResponse<IStripePlan[]>> {
    const cacheKey = "plans_all";

    const result = await withErrorHandling(
      async () => {
        const response = await apiClient.get<IStripePlan[]>("/api/plans");
        return {
          success: true,
          data: response.data,
        } as TStripeApiResponse<IStripePlan[]>;
      },
      "Erreur lors de la récupération des plans",
      cacheKey,
      10 * 60 * 1000 // Cache 10 minutes pour les plans (relativement stables)
    );

    return result as TStripeApiResponse<IStripePlan[]>;
  },
};

// Service des abonnements
export const subscriptionsService = {
  // Récupérer les abonnements d'un utilisateur
  async getByUserId(
    userId: string
  ): Promise<TStripeApiResponse<IStripeSubscription[]>> {
    const url = `/api/users/${userId}/subscriptions`;
    const cacheKey = `subscriptions_user_${userId}`;

    const result = await withErrorHandling(
      async () => {
        const response = await apiClient.get<IStripeSubscription[]>(url);
        return {
          success: true,
          data: response.data,
        } as TStripeApiResponse<IStripeSubscription[]>;
      },
      "Erreur lors de la récupération des abonnements",
      cacheKey,
      2 * 60 * 1000 // Cache 2 minutes pour les abonnements utilisateur
    );

    return result as TStripeApiResponse<IStripeSubscription[]>;
  },

  // Créer un abonnement gratuit (pour les plans gratuits uniquement)
  async createFreeSubscription(
    request: ICreateFreeSubscriptionRequest
  ): Promise<TStripeApiResponse<IStripeSubscription>> {
    try {
      const response = await apiClient.post<IStripeSubscription>(
        "/api/subscriptions",
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'abonnement gratuit:",
        error
      );
      return {
        success: false,
        error: "Erreur lors de la création de l'abonnement gratuit",
      };
    }
  },

  // Mettre à jour un abonnement (changement de plan)
  async updateSubscription(
    subscriptionId: string,
    request: IUpdateSubscriptionRequest
  ): Promise<TStripeApiResponse<ICreateSubscriptionResponse>> {
    try {
      const response = await apiClient.put<ICreateSubscriptionResponse>(
        `/api/stripe/subscription/${subscriptionId}`,
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'abonnement:", error);
      return {
        success: false,
        error: "Erreur lors de la mise à jour de l'abonnement",
      };
    }
  },

  // Annuler un abonnement
  async cancelSubscription(
    subscriptionId: string,
    request: ICancelSubscriptionRequest
  ): Promise<TStripeApiResponse<ICancelSubscriptionResponse>> {
    try {
      const response = await apiClient.post<ICancelSubscriptionResponse>(
        `/api/stripe/subscription/${subscriptionId}/cancel`,
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de l'annulation de l'abonnement:", error);
      return {
        success: false,
        error: "Erreur lors de l'annulation de l'abonnement",
      };
    }
  },
};

// Service Stripe (pour les opérations spécifiques à Stripe)
export const stripeService = {
  // Récupérer les produits Stripe
  async getProducts(): Promise<TStripeApiResponse<IStripeProductsResponse>> {
    try {
      const response = await apiClient.get<IStripeProductsResponse>(
        "/api/stripe/products"
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des produits Stripe:",
        error
      );
      return {
        success: false,
        error: "Erreur lors de la récupération des produits Stripe",
      };
    }
  },

  // Créer une session de checkout Stripe (méthode recommandée)
  async createCheckoutSession(
    request: ICheckoutSessionRequest
  ): Promise<TStripeApiResponse<ICheckoutSessionResponse>> {
    try {
      const response = await apiClient.post<ICheckoutSessionResponse>(
        "/api/stripe/checkout-session",
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session checkout:",
        error
      );
      return {
        success: false,
        error: "Erreur lors de la création de la session checkout",
      };
    }
  },

  // Vérifier le statut d'une session de checkout
  async getCheckoutSessionStatus(
    sessionId: string
  ): Promise<TStripeApiResponse<ICheckoutSessionStatus>> {
    try {
      const response = await apiClient.get<ICheckoutSessionStatus>(
        `/api/stripe/checkout-session/${sessionId}`
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de la vérification de la session:", error);
      return {
        success: false,
        error: "Erreur lors de la vérification de la session",
      };
    }
  },

  // Créer un abonnement directement (méthode avancée)
  async createSubscription(
    request: ICreateSubscriptionRequest
  ): Promise<TStripeApiResponse<ICreateSubscriptionResponse>> {
    try {
      const response = await apiClient.post<ICreateSubscriptionResponse>(
        "/api/stripe/subscription",
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'abonnement Stripe:",
        error
      );
      return {
        success: false,
        error: "Erreur lors de la création de l'abonnement Stripe",
      };
    }
  },

  // Ouvrir le portail client Stripe
  async createCustomerPortalSession(
    request: ICustomerPortalRequest
  ): Promise<TStripeApiResponse<ICustomerPortalResponse>> {
    try {
      const response = await apiClient.post<ICustomerPortalResponse>(
        "/api/stripe/customer-portal",
        request
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de la création du portail client:", error);
      return {
        success: false,
        error: "Erreur lors de la création du portail client",
      };
    }
  },

  // Récupérer les factures d'un utilisateur
  async getInvoices(
    limit?: number
  ): Promise<TStripeApiResponse<IInvoicesResponse>> {
    try {
      const params = limit ? { limit } : {};
      const response = await apiClient.get<IInvoicesResponse>(
        "/api/stripe/invoices",
        { params }
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      return {
        success: false,
        error: "Erreur lors de la récupération des factures",
      };
    }
  },
};
