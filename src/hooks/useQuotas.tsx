import { useCallback, useEffect, useState } from "react";
import { quotaAPI } from "../services/api.mock";
import { IQuotaStatus } from "../types";
import { useAuth } from "./useAuth";

interface IUseQuotasReturn {
  quotaStatus: IQuotaStatus | null;
  loading: boolean;
  error: string | null;
  refreshQuotas: () => Promise<void>;
}

export const useQuotas = (): IUseQuotasReturn => {
  const { user } = useAuth();
  const [quotaStatus, setQuotaStatus] = useState<IQuotaStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuotas = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await quotaAPI.getByUserId(user.id);
      if (response.success && response.data && response.data.length > 0) {
        // Prendre le quota du mois actuel ou le plus récent
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const currentQuota = response.data.find(
          (q) => q.month === currentMonth
        );
        setQuotaStatus(currentQuota || response.data[0]);
      }
    } catch {
      setError("Erreur lors du chargement des quotas");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Charger les quotas au montage et quand l'utilisateur change
  useEffect(() => {
    if (user?.id) {
      loadQuotas();
    }
  }, [user?.id, loadQuotas]);

  const refreshQuotas = async () => {
    await loadQuotas();
  };

  return {
    quotaStatus,
    loading,
    error,
    refreshQuotas,
  };
};
