import { Check, ChevronDown, Crown, Star, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { plansAPI } from "../services/api.mock";
import { IPlan } from "../types";

export function Subscription() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await plansAPI.getAll();
      if (response.success && response.data) {
        // Ajouter les propriétés manquantes pour l'interface utilisateur
        const plansWithUI = response.data.map((plan) => ({
          ...plan,
          price: plan.price_cents / 100,
          popular: plan.id === "plan-premium",
          features: getPlanFeatures(plan.id),
        }));
        setPlans(plansWithUI);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const getPlanFeatures = (planId: string): string[] => {
    switch (planId) {
      case "plan-free":
        return ["3 formulaires", "500 soumissions/mois", "10 Mo stockage"];
      case "plan-premium":
        return [
          "20 formulaires",
          "10 000 soumissions/mois",
          "100 Mo stockage",
          "Support prioritaire",
        ];
      case "plan-pro":
        return [
          "Formulaires illimités",
          "100 000 soumissions/mois",
          "500 Mo stockage",
          "Support prioritaire",
          "API avancée",
        ];
      default:
        return [];
    }
  };

  const handleSubscribe = (planId: string) => {
    // planId will be used when Stripe integration is implemented
    console.log("Selected plan:", planId);
    addToast({
      type: "info",
      title: "Fonctionnalité en cours",
      message: "L'intégration Stripe sera disponible prochainement",
    });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "plan-free":
        return <Star className="h-6 w-6 text-surface-500" />;
      case "plan-premium":
        return <Crown className="h-6 w-6 text-accent-500" />;
      case "plan-pro":
        return <Zap className="h-6 w-6 text-yellow-500" />;
      default:
        return <Star className="h-6 w-6 text-surface-500" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case "plan-free":
        return "border-surface-700";
      case "plan-premium":
        return "border-accent-500 ring-2 ring-accent-500";
      case "plan-pro":
        return "border-yellow-500";
      default:
        return "border-surface-700";
    }
  };

  const getButtonVariant = (planId: string, isCurrentPlan: boolean) => {
    if (isCurrentPlan) return "secondary";
    switch (planId) {
      case "plan-premium":
        return "accent";
      case "plan-pro":
        return "primary";
      default:
        return "secondary";
    }
  };

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  if (loading) {
    return (
      <div className="space-modern">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 loading-blur rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-modern">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-100 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-lg text-surface-400 max-w-2xl mx-auto">
          Créez des formulaires professionnels et collectez des données en toute
          sécurité
        </p>
      </div>

      {/* Current Plan Status */}
      {user && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPlanIcon(user.subscription?.plan || "plan-free")}
                <div>
                  <p className="font-medium text-text-100">
                    Plan actuel:{" "}
                    {user.subscription?.plan === "plan-free"
                      ? "Gratuit"
                      : user.subscription?.plan === "plan-premium"
                      ? "Premium"
                      : "Pro"}
                  </p>
                  <p className="text-sm text-surface-400">
                    {user.subscription?.currentForms || 0} /{" "}
                    {user.subscription?.maxForms || 0} formulaires utilisés
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-surface-400">
                  {user.subscription?.currentSubmissions || 0} /{" "}
                  {user.subscription?.maxSubmissionsPerMonth || 0}
                  <br />
                  soumissions ce mois
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = user?.subscription?.plan === plan.id;
          const isPopular = plan.popular;

          return (
            <Card
              key={plan.id}
              className={`relative ${getPlanColor(plan.id)} ${
                isPopular ? "shadow-large" : ""
              } flex flex-col`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-xl font-bold text-text-100">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-text-100">
                    {plan.price}€
                  </span>
                  <span className="text-surface-400">/mois</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-8">
                <ul className="space-y-2 flex-1">
                  {plan.features?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-surface-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-auto"
                  variant={getButtonVariant(plan.id, isCurrentPlan)}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? "Plan actuel" : "Choisir ce plan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-100 mt-20 mb-4">
          Questions fréquentes
        </h1>
        <p className="text-lg text-surface-400 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur nos produits et la facturation
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {[
          {
            id: "change-plan",
            question: "Puis-je changer de plan à tout moment ?",
            answer:
              "Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Les changements prennent effet immédiatement et sont proratisés.",
          },
          {
            id: "limits",
            question: "Que se passe-t-il si je dépasse mes limites ?",
            answer:
              "Vos formulaires continueront de fonctionner, mais vous recevrez des notifications pour vous encourager à passer à un plan supérieur.",
          },
          {
            id: "hidden-fees",
            question: "Y a-t-il des frais cachés ?",
            answer:
              "Non, tous les prix sont affichés clairement. Aucun frais caché.",
          },
          {
            id: "form-creation",
            question: "Combien de formulaires puis-je créer ?",
            answer:
              "Cela dépend de votre plan : 3 pour le gratuit, 20 pour le Premium, et illimité pour le Pro. Vous pouvez toujours mettre à niveau si vous avez besoin de plus.",
          },
          {
            id: "submissions",
            question: "Que se passe-t-il avec mes soumissions existantes ?",
            answer:
              "Toutes vos soumissions sont conservées lors du changement de plan. Vous gardez l'accès à toutes vos données existantes.",
          },
          {
            id: "support",
            question: "Quel type de support est inclus ?",
            answer:
              "Le plan gratuit inclut un support communautaire, tandis que les plans Premium et Pro bénéficient d'un support prioritaire par email et chat.",
          },
        ].map((faq) => (
          <div
            key={faq.id}
            className="bg-surface-900 border border-surface-700/50 rounded-xl p-4 cursor-pointer hover:bg-surface-800/50 transition-all duration-200"
            onClick={() => toggleFAQ(faq.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChevronDown
                  className={`h-4 w-4 text-surface-400 transition-transform duration-200 ${
                    openFAQ === faq.id ? "rotate-180" : ""
                  }`}
                />
                <h4 className="font-medium text-text-100 text-left">
                  {faq.question}
                </h4>
              </div>
            </div>

            {openFAQ === faq.id && (
              <div className="mt-4 pl-7">
                <p className="text-sm text-surface-400 text-left leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
