import { useEffect, useState } from "react";
import { versionsService } from "../services/api";
import {
  ICreateVersionRequest,
  IFormSchema,
  IFormVersion,
} from "../services/api/forms/formsTypes";

interface IUseFormVersionsReturn {
  versions: IFormVersion[];
  loading: boolean;
  error: string | null;
  createVersion: (formId: string, schema: IFormSchema) => Promise<boolean>;
  restoreVersion: (formId: string, versionNumber: number) => Promise<boolean>;
  deleteVersion: (formId: string, versionNumber: number) => Promise<boolean>;
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
      const response = await versionsService.getByFormId(id);
      if (response.success) {
        setVersions(response.data || []);
      } else {
        setError(response.message || "Erreur lors du chargement des versions");
      }
    } catch {
      setError("Erreur lors du chargement des versions");
    } finally {
      setLoading(false);
    }
  };

  const createVersion = async (
    id: string,
    schema: IFormSchema
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const versionData: ICreateVersionRequest = { schema };
      const response = await versionsService.create(id, versionData);

      if (response.success) {
        // Recharger les versions
        await loadVersions(id);
        return true;
      } else {
        setError(
          response.message || "Erreur lors de la création de la version"
        );
        return false;
      }
    } catch {
      setError("Erreur lors de la création de la version");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const restoreVersion = async (
    id: string,
    versionNumber: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await versionsService.restore(id, versionNumber);

      if (response.success) {
        // Recharger les versions
        await loadVersions(id);
        return true;
      } else {
        setError(
          response.message || "Erreur lors de la restauration de la version"
        );
        return false;
      }
    } catch {
      setError("Erreur lors de la restauration de la version");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (
    id: string,
    versionNumber: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await versionsService.delete(id, versionNumber);

      if (response.success) {
        // Recharger les versions
        await loadVersions(id);
        return true;
      } else {
        setError(
          response.message || "Erreur lors de la suppression de la version"
        );
        return false;
      }
    } catch {
      setError("Erreur lors de la suppression de la version");
      return false;
    } finally {
      setLoading(false);
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
    restoreVersion,
    deleteVersion,
    refreshVersions,
  };
};
