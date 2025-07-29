import { useEffect, useState } from "react";
import { featuresAPI } from "../services/api.mock";
import { IFeature } from "../types";

interface IUseFeaturesReturn {
  features: IFeature[];
  loading: boolean;
  error: string | null;
  refreshFeatures: () => Promise<void>;
}

export const useFeatures = (): IUseFeaturesReturn => {
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les fonctionnalités au montage
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await featuresAPI.getAll();
      if (response.success) {
        setFeatures(response.data || []);
      } else {
        setError(
          response.error || "Erreur lors du chargement des fonctionnalités"
        );
      }
    } catch {
      setError("Erreur lors du chargement des fonctionnalités");
    } finally {
      setLoading(false);
    }
  };

  const refreshFeatures = async () => {
    await loadFeatures();
  };

  return {
    features,
    loading,
    error,
    refreshFeatures,
  };
};
