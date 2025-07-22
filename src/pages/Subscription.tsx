import { useState, useEffect } from 'react';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';
import { Plan } from '../types';
import { plansAPI } from '../services/api';

export function Subscription() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await plansAPI.getAll();
      if (response.success && response.data) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (planId: string) => {
    addToast({
      type: 'info',
      title: 'Fonctionnalité en cours',
      message: 'L\'intégration Stripe sera disponible prochainement'
    });
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Star className="h-6 w-6 text-gray-600" />;
      case 'premium':
        return <Crown className="h-6 w-6 text-blue-600" />;
      case 'pro':
        return <Zap className="h-6 w-6 text-purple-600" />;
      default:
        return <Star className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'border-gray-200';
      case 'premium':
        return 'border-blue-500 ring-2 ring-blue-500';
      case 'pro':
        return 'border-purple-500';
      default:
        return 'border-gray-200';
    }
  };

  const getButtonVariant = (planId: string, isCurrentPlan: boolean) => {
    if (isCurrentPlan) return 'outline';
    switch (planId) {
      case 'premium':
        return 'primary';
      case 'pro':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Créez des formulaires professionnels et collectez des données en toute sécurité
        </p>
      </div>

      {/* Current Plan Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getPlanIcon(user?.subscription.plan || 'free')}
              <div>
                <h3 className="font-semibold text-gray-900">
                  Plan actuel: {user?.subscription.plan === 'free' ? 'Gratuit' : 
                               user?.subscription.plan === 'premium' ? 'Premium' : 'Pro'}
                </h3>
                <p className="text-sm text-gray-600">
                  {user?.subscription.currentForms || 0} / {user?.subscription.maxForms || 0} formulaires utilisés
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Soumissions ce mois</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.subscription.currentSubmissions || 0} / {user?.subscription.maxSubmissionsPerMonth || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = user?.subscription.plan === plan.id;
          const isPopular = plan.popular;

          return (
            <Card 
              key={plan.id} 
              className={`relative ${getPlanColor(plan.id)} ${isPopular ? 'shadow-lg' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={getButtonVariant(plan.id, isCurrentPlan)}
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Plan actuel' : 'Choisir ce plan'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Questions fréquentes</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Puis-je changer de plan à tout moment ?
            </h4>
            <p className="text-sm text-gray-600">
              Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. 
              Les changements prennent effet immédiatement.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Que se passe-t-il si je dépasse mes quotas ?
            </h4>
            <p className="text-sm text-gray-600">
              Vos formulaires continueront de fonctionner, mais vous recevrez des notifications 
              pour vous encourager à passer à un plan supérieur.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Les données sont-elles sécurisées ?
            </h4>
            <p className="text-sm text-gray-600">
              Oui, toutes les données sont chiffrées et stockées de manière sécurisée. 
              Nous respectons le RGPD et les meilleures pratiques de sécurité.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Une question ? Contactez-nous</h3>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            addToast({
              type: 'success',
              title: 'Message envoyé',
              message: 'Nous vous répondrons dans les plus brefs délais'
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sujet
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="billing">Facturation</option>
                <option value="technical">Support technique</option>
                <option value="feature">Demande de fonctionnalité</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez votre question ou problème..."
              />
            </div>
            <Button type="submit" className="w-full">
              Envoyer le message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}