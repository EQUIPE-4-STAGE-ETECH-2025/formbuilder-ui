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
  plansLoading: boolean;
  subscriptionsLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Cache global pour les plans (statiques)
let plansCache: IStripePlan[] = [];
let plansCacheLoaded = false;

export const useSubscriptions = (): IUseSubscriptionsReturn => {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<IStripeSubscription[]>([]);
  const [plans, setPlans] = useState<IStripePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [plansLoading, setPlansLoading] = useState(true);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Charger les plans et abonnements en parallèle pour optimiser les performances
      const promises: Promise<void>[] = [];

      // Charger les plans (avec cache)
      const loadPlans = async () => {
        if (plansCacheLoaded && plansCache.length > 0) {
          setPlans(plansCache);
          setPlansLoading(false);
          return;
        }

        try {
          const plansResponse = await plansService.getAll();
          if (plansResponse.success && plansResponse.data) {
            setPlans(plansResponse.data);
            plansCache = plansResponse.data;
            plansCacheLoaded = true;
          }
        } catch (err) {
          console.error("Erreur lors du chargement des plans:", err);
        } finally {
          setPlansLoading(false);
        }
      };

      // Charger les abonnements seulement si l'utilisateur est connecté
      const loadSubscriptions = async () => {
        if (!user?.id) {
          setSubscriptionsLoading(false);
          return;
        }

        try {
          const subscriptionsResponse = await subscriptionsService.getByUserId(
            user.id
          );
          if (subscriptionsResponse.success && subscriptionsResponse.data) {
            setSubscriptions(subscriptionsResponse.data);
          }
        } catch (err) {
          console.error("Erreur lors du chargement des abonnements:", err);
        } finally {
          setSubscriptionsLoading(false);
        }
      };

      // Exécuter les chargements en parallèle
      promises.push(loadPlans(), loadSubscriptions());
      await Promise.all(promises);
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
    // Invalider le cache des plans pour forcer le rechargement
    plansCacheLoaded = false;
    plansCache = [];
    await loadData();
  };

  return {
    subscriptions,
    plans,
    loading,
    plansLoading,
    subscriptionsLoading,
    error,
    refreshData,
  };
};
