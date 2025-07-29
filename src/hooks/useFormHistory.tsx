import { useState } from "react";
import { formVersionsAPI } from "../services/api";
import { IFormVersion } from "../types";

interface IUseFormHistoryReturn {
  versions: IFormVersion[];
  loading: boolean;
  error: string | null;
  getVersions: (formId: string) => Promise<void>;
  getVersion: (formId: string, version: number) => Promise<IFormVersion | null>;
  restoreVersion: (formId: string, version: number) => Promise<boolean>;
  deleteVersion: (formId: string, version: number) => Promise<boolean>;
}

export const useFormHistory = (): IUseFormHistoryReturn => {
  // Hooks
  const [versions, setVersions] = useState<IFormVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonctions utilitaires
  const getVersions = async (formId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await formVersionsAPI.getByFormId(formId);

      if (response.success && response.data) {
        setVersions(
          response.data.sort(
            (a: IFormVersion, b: IFormVersion) =>
              b.version_number - a.version_number
          )
        );
      } else {
        setError(response.error || "Erreur lors du chargement de l'historique");
      }
    } catch {
      setError("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  const getVersion = async (
    formId: string,
    version: number
  ): Promise<IFormVersion | null> => {
    try {
      setLoading(true);
      setError(null);
      const versions = await formVersionsAPI.getByFormId(formId);

      if (versions.success && versions.data) {
        const targetVersion = versions.data.find(
          (v) => v.version_number === version
        );
        return targetVersion || null;
      } else {
        setError(
          versions.error || "Erreur lors de la récupération de la version"
        );
        return null;
      }
    } catch {
      setError("Erreur lors de la récupération de la version");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const restoreVersion = async (
    formId: string,
    version: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la version à restaurer
      const versions = await formVersionsAPI.getByFormId(formId);
      if (!versions.success || !versions.data) {
        setError("Erreur lors de la récupération des versions");
        return false;
      }

      const targetVersion = versions.data.find(
        (v) => v.version_number === version
      );
      if (!targetVersion) {
        setError("Version non trouvée");
        return false;
      }

      const response = await formVersionsAPI.restore(targetVersion.id);

      if (response.success) {
        // Recharger les versions après restauration
        await getVersions(formId);
        return true;
      } else {
        setError(response.error || "Erreur lors de la restauration");
        return false;
      }
    } catch {
      setError("Erreur lors de la restauration");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (
    formId: string,
    version: number
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer la version à supprimer
      const versions = await formVersionsAPI.getByFormId(formId);
      if (!versions.success || !versions.data) {
        setError("Erreur lors de la récupération des versions");
        return false;
      }

      const targetVersion = versions.data.find(
        (v) => v.version_number === version
      );
      if (!targetVersion) {
        setError("Version non trouvée");
        return false;
      }

      const response = await formVersionsAPI.delete(targetVersion.id);

      if (response.success) {
        // Recharger les versions après suppression
        await getVersions(formId);
        return true;
      } else {
        setError(response.error || "Erreur lors de la suppression");
        return false;
      }
    } catch {
      setError("Erreur lors de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    versions,
    loading,
    error,
    getVersions,
    getVersion,
    restoreVersion,
    deleteVersion,
  };
};
