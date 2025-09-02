import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { quotasService } from "../services/api";
import { IQuotaStatus } from "../services/api/quotas/quotaTypes";

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
      const response = await quotasService.getByUserId(user.id);
      if (response.success && response.data) {
        setQuotaStatus(response.data);
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
