import { Calendar, CreditCard, Crown, Zap } from "lucide-react";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import { IPlan, ISubscription } from "../../types";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";

interface ISubscriptionCardProps {
  subscription?: ISubscription;
  plan?: IPlan;
}

export function SubscriptionCard({
  subscription,
  plan,
}: ISubscriptionCardProps) {
  const { loading, createSubscription, cancelSubscription } =
    useSubscriptions();

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(priceCents / 100);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "pro":
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case "premium":
        return <Zap className="h-5 w-5 text-accent-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-surface-500" />;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Inactif
      </span>
    );
  };

  if (!subscription && !plan) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-surface-500" />
            <h3 className="text-lg font-semibold text-text-100">Abonnement</h3>
          </div>
          <div className="text-center py-8">
            <div className="text-surface-500 mb-4">
              <CreditCard className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-text-100 mb-2">
              Aucun abonnement actif
            </h3>
            <p className="text-surface-400 mb-4">
              Choisissez un plan pour commencer à utiliser FormBuilder
            </p>
            <Button disabled={loading} variant="accent">
              {loading ? "Chargement..." : "Voir les plans"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plan && getPlanIcon(plan.name)}
            <h3 className="text-lg font-semibold text-text-100">Abonnement</h3>
          </div>
          {subscription && getStatusBadge(subscription.is_active)}
        </div>
        {plan && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-text-100">Plan actuel</span>
              <span className="text-lg font-bold text-text-100">
                {plan.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-surface-400">Prix</span>
              <span className="font-medium text-text-100">
                {formatPrice(plan.price_cents)}/mois
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-400">Formulaires max</span>
                <span className="font-medium text-text-100">
                  {plan.max_forms === -1 ? "Illimité" : plan.max_forms}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-400">Soumissions/mois</span>
                <span className="font-medium text-text-100">
                  {plan.max_submissions_per_month === -1
                    ? "Illimité"
                    : plan.max_submissions_per_month.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-400">Stockage</span>
                <span className="font-medium text-text-100">
                  {plan.max_storage_mb} Mo
                </span>
              </div>
            </div>
          </div>
        )}

        {subscription && (
          <div className="space-y-2 pt-4 border-t border-surface-700">
            <div className="flex items-center gap-2 text-sm text-surface-400">
              <Calendar className="h-4 w-4" />
              <span>Période d'abonnement</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">Début</span>
              <span className="font-medium text-text-100">
                {new Date(subscription.start_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">Fin</span>
              <span className="font-medium text-text-100">
                {new Date(subscription.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-400">ID Stripe</span>
              <span className="font-mono text-xs text-surface-500">
                {subscription.stripe_subscription_id}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {subscription?.is_active ? (
            <Button
              variant="secondary"
              onClick={() => cancelSubscription(subscription.id)}
              disabled={loading}
            >
              {loading ? "Annulation..." : "Annuler l'abonnement"}
            </Button>
          ) : (
            <Button
              variant="accent"
              onClick={() => plan && createSubscription(plan.id)}
              disabled={loading}
            >
              {loading ? "Activation..." : "Activer l'abonnement"}
            </Button>
          )}
          <Button variant="secondary">Gérer l'abonnement</Button>
        </div>
      </CardContent>
    </Card>
  );
}
