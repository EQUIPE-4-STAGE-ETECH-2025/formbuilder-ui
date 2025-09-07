import { useCallback, useEffect, useState } from "react";
import {
  plansService,
  subscriptionsService,
} from "../services/api/subscriptions/subscriptionsService";
import {
  IStripePlan,
  IStripeSubscription,
} from "../services/api/subscriptions/subscriptionsTypes";
import { useAuth } from "./useAuth";

interface IUseSubscriptionsReturn {
  subscriptions: IStripeSubscription[];
  plans: IStripePlan[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export const useSubscriptions = (): IUseSubscriptionsReturn => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<IStripeSubscription[]>([]);
  const [plans, setPlans] = useState<IStripePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Toujours charger les plans
      const plansResponse = await plansService.getAll();

      if (plansResponse.success && plansResponse.data) {
        setPlans(plansResponse.data);
      }

      // Charger les abonnements seulement si l'utilisateur est connecté
      if (user?.id) {
        const subscriptionsResponse = await subscriptionsService.getByUserId(
          user.id
        );

        if (subscriptionsResponse.success && subscriptionsResponse.data) {
          setSubscriptions(subscriptionsResponse.data);
        }
      }
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fonction pour actualiser les données manuellement
  const refreshData = async (): Promise<void> => {
    await loadData();
  };

  return {
    subscriptions,
    plans,
    loading,
    error,
    refreshData,
  };
};
