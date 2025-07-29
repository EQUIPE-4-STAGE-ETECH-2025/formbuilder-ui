import { useEffect, useState } from "react";
import { plansAPI, subscriptionsAPI } from "../services/api";
import { IPlan, ISubscription } from "../types";

interface IUseSubscriptionsReturn {
  subscriptions: ISubscription[];
  plans: IPlan[];
  loading: boolean;
  error: string | null;
  createSubscription: (planId: string) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string) => Promise<boolean>;
  updateSubscription: (
    subscriptionId: string,
    planId: string
  ) => Promise<boolean>;
}

export const useSubscriptions = (): IUseSubscriptionsReturn => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [plansResponse, subscriptionsResponse] = await Promise.all([
        plansAPI.getAll(),
        subscriptionsAPI.getByUserId("user-1"), // Mock user ID
      ]);

      if (plansResponse.success && plansResponse.data) {
        setPlans(plansResponse.data);
      }

      if (subscriptionsResponse.success && subscriptionsResponse.data) {
        setSubscriptions(subscriptionsResponse.data);
      }
    } catch {
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createSubscription = async (planId: string): Promise<boolean> => {
    try {
      setLoading(true);
      // In real app, would call API with planId
      console.log("Creating subscription for plan:", planId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadData(); // Refresh data
      return true;
    } catch {
      setError("Erreur lors de la création de l'abonnement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (
    subscriptionId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      // In real app, would call API with subscriptionId
      console.log("Cancelling subscription:", subscriptionId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadData(); // Refresh data
      return true;
    } catch {
      setError("Erreur lors de l'annulation de l'abonnement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (
    subscriptionId: string,
    planId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      // In real app, would call API with subscriptionId and planId
      console.log("Updating subscription:", subscriptionId, "to plan:", planId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadData(); // Refresh data
      return true;
    } catch {
      setError("Erreur lors de la mise à jour de l'abonnement");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    subscriptions,
    plans,
    loading,
    error,
    createSubscription,
    cancelSubscription,
    updateSubscription,
  };
};
