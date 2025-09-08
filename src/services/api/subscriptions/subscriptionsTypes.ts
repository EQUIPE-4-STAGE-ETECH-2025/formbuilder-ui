// Types pour l'intégration Stripe - Basé sur l'API backend

// Interface Plan selon l'API backend
export interface IStripePlan {
  id: string;
  name: string;
  priceCents: number;
  stripeProductId: string;
  stripePriceId: string | null;
  maxForms: number;
  maxSubmissionsPerMonth: number;
  maxStorageMb: number;
  features: Array<{
    id: string;
    code: string;
    label: string;
  }>;
}

// Interface Abonnement selon l'API backend
export interface IStripeSubscription {
  id: string;
  userId: string;
  planName: string;
  stripeSubscriptionId: string;
  startDate: string;
  endDate: string | null; // null pour les plans gratuits illimités
  status: string;
  isActive: boolean;
}

// Types pour Stripe Checkout
export interface ICheckoutSessionRequest {
  price_id: string;
  success_url: string;
  cancel_url: string;
  quantity: number;
  mode: "subscription";
  metadata?: {
    plan_name?: string;
    user_source?: string;
  };
  allow_promotion_codes?: boolean;
  trial_period_days?: number;
}

export interface ICheckoutSessionResponse {
  session_id: string;
  url: string;
  status: string;
}

// Types pour le statut de session
export interface ICheckoutSessionStatus {
  session: {
    id: string;
    payment_status: string;
    status: string;
    customer: string;
    subscription: string;
    metadata: Record<string, string>;
  };
}

// Types pour la création d'abonnement direct
export interface ICreateSubscriptionRequest {
  price_id: string;
  quantity: number;
  trial_period_days?: number;
  metadata?: {
    plan_name?: string;
  };
  default_payment_method?: string;
}

export interface ICreateSubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    trial_end?: number;
  };
  status: string;
}

// Types pour la mise à jour d'abonnement
export interface IUpdateSubscriptionRequest {
  price_id: string;
  quantity: number;
}

// Types pour l'annulation d'abonnement
export interface ICancelSubscriptionRequest {
  immediately: boolean;
}

export interface ICancelSubscriptionResponse {
  subscription: {
    id: string;
    status: string;
    cancel_at_period_end: boolean;
    canceled_at: number;
  };
  status: string;
}

// Types pour le portail client
export interface ICustomerPortalRequest {
  return_url: string;
}

export interface ICustomerPortalResponse {
  session_id: string;
  url: string;
  status: string;
}

// Types pour les factures
export interface IStripeInvoice {
  id: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  created: number;
  due_date: number;
  hosted_invoice_url: string;
  invoice_pdf: string;
}

export interface IInvoicesResponse {
  invoices: IStripeInvoice[];
  status: string;
}

// Types pour les produits Stripe
export interface IStripeProduct {
  id: string;
  name: string;
  description: string;
  default_price: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: string;
      interval_count: number;
    };
  };
  metadata: Record<string, string>;
}

export interface IStripeProductsResponse {
  products: IStripeProduct[];
  status: string;
}

// Types pour les erreurs Stripe
export interface IStripeError {
  error: string;
  message: string;
  details?: string[];
}

// Types de réponse génériques pour Stripe
export type TStripeApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

// Types pour la création d'abonnement gratuit (legacy)
export interface ICreateFreeSubscriptionRequest {
  userEmail: string;
  planId: string;
}
