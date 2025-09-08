import {
  Check,
  ChevronDown,
  Crown,
  ExternalLink,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";
import { useStripe } from "../hooks/useStripe";
import { useSubscriptions } from "../hooks/useSubscriptions";
import { useToast } from "../hooks/useToast";
import { IStripePlan } from "../services/api/subscriptions/subscriptionsTypes";

export function Subscription() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const hasProcessedUrlParamsRef = useRef(false);

  // Utiliser les nouveaux hooks
  const { plans, subscriptions, loading, error, refreshData } =
    useSubscriptions();
  const {
    subscribeToPlan,
    openCustomerPortal,
    checkCheckoutSessionStatus,
    loading: stripeLoading,
  } = useStripe();

  // Trouver l'abonnement actif de l'utilisateur (un seul maintenant)
  const activeSubscription = subscriptions.find((sub) => sub.isActive);

  // Trouver le plan actuel de l'utilisateur
  const currentPlan = activeSubscription
    ? plans.find((plan) => plan.name === activeSubscription.planName)
    : plans.find((plan) => plan.priceCents === 0); // Plan gratuit par défaut

  // Gérer les paramètres d'URL pour les redirections Stripe
  useEffect(() => {
    const handleUrlParams = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get("session_id");
      const canceled = params.get("canceled");

      // Éviter les traitements multiples
      if (hasProcessedUrlParamsRef.current || (!sessionId && !canceled)) {
        return;
      }

      hasProcessedUrlParamsRef.current = true;

      // Nettoyer l'URL des paramètres immédiatement
      window.history.replaceState({}, document.title, window.location.pathname);

      if (canceled === "true") {
        addToast({
          type: "info",
          title: "Paiement annulé",
          message:
            "Votre processus d'abonnement a été annulé. Aucun frais n'a été prélevé.",
        });
        return;
      }

      if (sessionId) {
        try {
          // TODO: Temporairement commenté pour la démo - à réactiver après
          // const success = await checkCheckoutSessionStatus(sessionId);
          // if (success) {
          await refreshData();
          addToast({
            type: "success",
            title: "Paiement réussi !",
            message:
              "Félicitations ! Votre abonnement a été activé avec succès.",
          });
          // } else {
          //   addToast({
          //     type: "error",
          //     title: "Erreur de paiement",
          //     message:
          //       "Impossible de vérifier votre paiement. Veuillez réessayer.",
          //   });
          // }
        } catch (error) {
          console.error("Erreur lors de la vérification de la session:", error);
          addToast({
            type: "error",
            title: "Erreur",
            message: "Impossible de vérifier le paiement",
          });
        }
      }
    };

    handleUrlParams();
  }, [location.search, checkCheckoutSessionStatus, refreshData, addToast]);

  useEffect(() => {
    if (error) {
      addToast({
        type: "error",
        title: "Erreur",
        message: error,
      });
    }
  }, [error, addToast]);

  // Mapper les features des plans depuis les données de l'API
  const getPlanFeatures = (plan: IStripePlan): string[] => {
    const baseFeatures = [
      `${
        plan.maxForms === -1
          ? "Formulaires illimités"
          : `${plan.maxForms} formulaires`
      }`,
      `${plan.maxSubmissionsPerMonth.toLocaleString()} soumissions/mois`,
      `${plan.maxStorageMb} Mo de stockage`,
    ];

    // Ajouter les fonctionnalités spécifiques depuis l'API
    const apiFeatures = plan.features?.map((feature) => feature.label) || [];

    return [...baseFeatures, ...apiFeatures];
  };

  // Gérer l'abonnement à un plan
  const handleSubscribe = async (plan: IStripePlan) => {
    if (!user) {
      addToast({
        type: "error",
        title: "Connexion requise",
        message: "Vous devez être connecté pour vous abonner",
      });
      return;
    }

    // Plan gratuit - déjà attribué automatiquement à l'inscription
    if (plan.priceCents === 0) {
      addToast({
        type: "info",
        title: "Plan gratuit",
        message: "Vous avez déjà le plan gratuit automatiquement !",
      });
      return;
    }

    // Plans payants
    if (plan.stripePriceId) {
      try {
        setLoadingPlanId(plan.id);

        // Vérifier si l'utilisateur a déjà un abonnement payant actif
        const hasActivePaidSubscription =
          activeSubscription && currentPlan && currentPlan.priceCents > 0;

        if (hasActivePaidSubscription) {
          // Utilisateur avec abonnement payant → rediriger vers le portail client
          await openCustomerPortal();
        } else {
          // Utilisateur avec plan gratuit → utiliser Stripe Checkout
          await subscribeToPlan(plan.stripePriceId);
        }
      } catch (error) {
        console.error("Erreur lors de l'abonnement:", error);
      } finally {
        setLoadingPlanId(null);
      }
    } else {
      addToast({
        type: "error",
        title: "Erreur",
        message: "Ce plan n'est pas disponible pour l'abonnement",
      });
    }
  };

  // Obtenir l'icône d'un plan
  const getPlanIcon = (plan: IStripePlan) => {
    // Déterminer le type de plan en fonction du prix
    if (plan.priceCents === 0) {
      return <Star className="h-6 w-6 text-surface-500" />;
    } else if (plan.priceCents < 5000) {
      // Moins de 50€
      return <Crown className="h-6 w-6 text-accent-500" />;
    } else {
      return <Zap className="h-6 w-6 text-yellow-500" />;
    }
  };

  // Obtenir les couleurs d'un plan
  const getPlanColor = (plan: IStripePlan, isPopular: boolean) => {
    if (isPopular) {
      return "border-accent-500 ring-2 ring-accent-500";
    }
    if (plan.priceCents === 0) {
      return "border-surface-700";
    } else if (plan.priceCents < 5000) {
      return "border-accent-500";
    } else {
      return "border-yellow-500";
    }
  };

  // Obtenir le variant du bouton
  const getButtonVariant = (
    plan: IStripePlan,
    isCurrentPlan: boolean,
    isPopular: boolean
  ) => {
    if (isCurrentPlan) return "secondary";
    if (isPopular) return "accent";
    if (plan.priceCents === 0) return "secondary";
    if (plan.priceCents >= 5000) return "primary";
    return "accent";
  };

  const toggleFAQ = (faqId: string) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  // États de chargement
  const isLoading = loading || stripeLoading;

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
      {user && currentPlan && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getPlanIcon(currentPlan)}
                <div>
                  <p className="font-medium text-text-100">
                    Plan actuel : {currentPlan.name}
                  </p>
                  {activeSubscription?.endDate ? (
                    <p className="text-sm text-surface-400">
                      Date d'expiration :{" "}
                      {new Date(activeSubscription.endDate).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  ) : currentPlan?.priceCents === 0 ? (
                    <p className="text-sm text-surface-400">
                      Date d'expiration : Aucune
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Boutons de gestion d'abonnement */}
                <div className="flex gap-2">
                  {activeSubscription &&
                    activeSubscription.stripeSubscriptionId && (
                      <>
                        <Button
                          variant="secondary"
                          size="md"
                          onClick={openCustomerPortal}
                          disabled={isLoading || currentPlan?.priceCents === 0}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Accéder au portail
                        </Button>
                      </>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan?.id === plan.id;
          const isPopular = plan.name.toLowerCase().includes("premium");
          const planFeatures = getPlanFeatures(plan);
          const priceDisplay = `${(plan.priceCents / 100).toFixed(0)}€`;

          return (
            <Card
              key={plan.id}
              className={`relative ${getPlanColor(plan, isPopular)} ${
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
                  {getPlanIcon(plan)}
                </div>
                <h3 className="text-xl font-bold text-text-100">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-text-100">
                    {priceDisplay}
                  </span>
                  <span className="text-surface-400">/mois</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-8">
                <ul className="space-y-2 flex-1">
                  {planFeatures.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-surface-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full mt-auto"
                  variant={getButtonVariant(plan, isCurrentPlan, isPopular)}
                  onClick={() => handleSubscribe(plan)}
                  disabled={isCurrentPlan || loadingPlanId === plan.id}
                >
                  {loadingPlanId === plan.id ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </div>
                  ) : isCurrentPlan ? (
                    "Plan actuel"
                  ) : (
                    "Choisir ce plan"
                  )}
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
