import { useCallback, useEffect, useMemo, useState } from "react";
import { quotasService } from "../services/api";
import {
  IQuotaStatus,
  QuotaExceededError,
} from "../services/api/quotas/quotaTypes";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";

interface IUseQuotasReturn {
  quotaStatus: IQuotaStatus | null;
  loading: boolean;
  error: string | null;
  refreshQuotas: () => Promise<void>;
  quotaError: QuotaExceededError | null;
  showUpgradeModal: boolean;
  handleQuotaError: (error: unknown) => void;
  clearQuotaError: () => void;
}

export const useQuotas = (): IUseQuotasReturn => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [quotaStatus, setQuotaStatus] = useState<IQuotaStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quotaError, setQuotaError] = useState<QuotaExceededError | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mémorisation de l'ID utilisateur
  const userId = useMemo(() => user?.id, [user?.id]);

  const loadQuotas = useCallback(
    async (skipLoading = false) => {
      if (!userId) return;

      if (!skipLoading) {
        setLoading(true);
      }
      setError(null);

      try {
        // Utilise maintenant le cache automatique du service
        const response = await quotasService.getByUserId(userId);

        if (response.success && response.data) {
          setQuotaStatus(response.data);
        } else {
          setError(response.message || "Erreur lors du chargement des quotas");
        }
      } catch {
        setError("Erreur lors du chargement des quotas");
      } finally {
        if (!skipLoading) {
          setLoading(false);
        }
      }
    },
    [userId]
  );

  useEffect(() => {
    if (userId) {
      loadQuotas();
    }
  }, [userId, loadQuotas]);

  const refreshQuotas = async () => {
    await loadQuotas();
  };

  const getActionLabel = (actionType: string): string => {
    switch (actionType) {
      case "create_form":
        return "créer des formulaires";
      case "submit_form":
        return "recevoir des soumissions";
      case "upload_file":
        return "stocker des fichiers";
      default:
        return "effectuer cette action";
    }
  };

  const getUpgradeMessage = (actionType: string): string => {
    switch (actionType) {
      case "create_form":
        return "Passez à un plan supérieur pour créer plus de formulaires.";
      case "submit_form":
        return "Passez à un plan supérieur pour accepter plus de soumissions par mois.";
      case "upload_file":
        return "Passez à un plan supérieur pour plus d'espace de stockage.";
      default:
        return "Passez à un plan supérieur pour débloquer cette fonctionnalité.";
    }
  };

  const handleQuotaError = (error: unknown) => {
    if (error instanceof QuotaExceededError) {
      setQuotaError(error);
      setShowUpgradeModal(true);

      const actionLabel = getActionLabel(error.getActionType());
      const upgradeMessage = getUpgradeMessage(error.getActionType());

      addToast({
        type: "warning",
        title: "Quota Dépassé",
        message: `Vous ne pouvez plus ${actionLabel}. ${upgradeMessage}`,
        duration: 8000,
      });
    }
  };

  const clearQuotaError = () => {
    setQuotaError(null);
    setShowUpgradeModal(false);
  };

  return {
    quotaStatus,
    loading,
    error,
    refreshQuotas,
    quotaError,
    showUpgradeModal,
    handleQuotaError,
    clearQuotaError,
  };
};
