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
        return <Crown className="h-5 w-5" />;
      case "premium":
        return <Zap className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Actif
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Inactif
      </span>
    );
  };

  if (!subscription && !plan) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Abonnement</h3>
          </div>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <CreditCard className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun abonnement actif
            </h3>
            <p className="text-gray-600 mb-4">
              Choisissez un plan pour commencer à utiliser FormBuilder
            </p>
            <Button disabled={loading}>
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
            <h3 className="text-lg font-semibold">Abonnement</h3>
          </div>
          {subscription && getStatusBadge(subscription.is_active)}
        </div>
        {plan && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Plan actuel</span>
              <span className="text-lg font-bold">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Prix</span>
              <span className="font-medium">
                {formatPrice(plan.price_cents)}/mois
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Formulaires max</span>
                <span className="font-medium">
                  {plan.max_forms === -1 ? "Illimité" : plan.max_forms}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Soumissions/mois</span>
                <span className="font-medium">
                  {plan.max_submissions_per_month === -1
                    ? "Illimité"
                    : plan.max_submissions_per_month.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Stockage</span>
                <span className="font-medium">{plan.max_storage_mb} Mo</span>
              </div>
            </div>
          </div>
        )}

        {subscription && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Période d'abonnement</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Début</span>
              <span className="font-medium">
                {new Date(subscription.start_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Fin</span>
              <span className="font-medium">
                {new Date(subscription.end_date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ID Stripe</span>
              <span className="font-mono text-xs text-gray-500">
                {subscription.stripe_subscription_id}
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          {subscription?.is_active ? (
            <Button
              variant="outline"
              onClick={() => cancelSubscription(subscription.id)}
              disabled={loading}
            >
              {loading ? "Annulation..." : "Annuler l'abonnement"}
            </Button>
          ) : (
            <Button
              onClick={() => plan && createSubscription(plan.id)}
              disabled={loading}
            >
              {loading ? "Activation..." : "Activer l'abonnement"}
            </Button>
          )}
          <Button variant="outline">Gérer l'abonnement</Button>
        </div>
      </CardContent>
    </Card>
  );
}
