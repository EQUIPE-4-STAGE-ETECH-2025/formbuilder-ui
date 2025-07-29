import { useEffect, useState } from "react";
import { formVersionsAPI } from "../services/api";
import { IFormVersion } from "../types";

interface IUseFormVersionsReturn {
  versions: IFormVersion[];
  loading: boolean;
  error: string | null;
  createVersion: (
    formId: string,
    schema: IFormVersion["schema"]
  ) => Promise<boolean>;
  getVersion: (versionId: string) => Promise<IFormVersion | null>;
  refreshVersions: (formId: string) => Promise<void>;
}

export const useFormVersions = (formId?: string): IUseFormVersionsReturn => {
  const [versions, setVersions] = useState<IFormVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les versions quand le formId change
  useEffect(() => {
    if (formId) {
      loadVersions(formId);
    }
  }, [formId]);

  const loadVersions = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await formVersionsAPI.getByFormId(id);
      if (response.success) {
        setVersions(response.data || []);
      } else {
        setError(response.error || "Erreur lors du chargement des versions");
      }
    } catch {
      setError("Erreur lors du chargement des versions");
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (
    id: string,
    schema: IFormVersion["schema"]
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await formVersionsAPI.create(id, schema);

      if (response.success) {
        // Recharger les versions
        await loadVersions(id);
        return true;
      } else {
        setError(response.error || "Erreur lors de la création de la version");
        return false;
      }
    } catch {
      setError("Erreur lors de la création de la version");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getVersion = async (
    versionId: string
  ): Promise<IFormVersion | null> => {
    try {
      const response = await formVersionsAPI.getById(versionId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  };

  const refreshVersions = async (id: string) => {
    await loadVersions(id);
  };

  return {
    versions,
    loading,
    error,
    createVersion,
    getVersion,
    refreshVersions,
  };
};
